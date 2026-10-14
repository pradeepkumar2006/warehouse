import os
from pathlib import Path
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.models.report import Report
from app.models.audit import AuditLog
from app.schemas.report import ReportGenerateRequest
from app.services.pdf_generator import generate_warehouse_pdf_report
from app.services.csv_generator import generate_warehouse_csv_report

router = APIRouter()

def background_generate_report(report_id: str, payload: dict):
    from app.core.database import SessionLocal
    db = SessionLocal()
    try:
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            return
            
        file_ext = "pdf" if report.format.upper() == "PDF" else "csv"
        file_name = f"{report.id.lower()}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}.{file_ext}"
        file_path = settings.REPORTS_DIR / file_name
        
        if report.format.upper() == "PDF":
            generate_warehouse_pdf_report(
                file_path=file_path,
                report_title=report.name,
                report_type=report.type,
                created_by=report.created_by,
                date_str=report.date,
                include_charts=payload.get("includeCharts", True)
            )
        else:
            generate_warehouse_csv_report(
                file_path=file_path,
                report_title=report.name,
                report_type=report.type,
                created_by=report.created_by,
                date_str=report.date
            )
            
        file_size_kb = round(file_path.stat().st_size / 1024, 1)
        size_str = f"{file_size_kb} KB" if file_size_kb < 1000 else f"{round(file_size_kb / 1024, 1)} MB"
        
        report.file_path = str(file_path)
        report.size = size_str
        report.status = "Ready"
        db.commit()
    except Exception as e:
        print(f"Error generating report {report_id}: {e}")
        if report:
            report.status = "Failed"
            db.commit()
    finally:
        db.close()

@router.get("/reports")
def get_reports(db: Session = Depends(get_db)):
    reports = db.query(Report).order_by(Report.created_at.desc()).all()
    result = []
    for r in reports:
        result.append({
            "id": r.id,
            "name": r.name,
            "type": r.type,
            "date": r.date,
            "format": r.format,
            "createdBy": r.created_by,
            "status": r.status,
            "size": r.size,
            "downloadUrl": f"/api/v1/reports/{r.id}/download"
        })
    return result

@router.post("/reports/generate")
def create_report(
    payload: ReportGenerateRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    count = db.query(Report).count() + 1
    report_id = f"REP-{count:03d}"
    report_name = payload.customReportName.strip() if payload.customReportName else f"{payload.type} ({payload.dateRange})"
    
    report = Report(
        id=report_id,
        name=report_name,
        type=payload.type,
        date=datetime.utcnow().strftime("%Y-%m-%d"),
        format=payload.format.upper(),
        created_by=payload.createdBy or "Sarah Lin (Admin)",
        status="Generating",
        size="Processing..."
    )
    db.add(report)
    db.commit()
    
    # Generate immediately or in background task
    background_tasks.add_task(background_generate_report, report_id, payload.dict())
    
    return {
        "success": True,
        "reportId": report_id,
        "status": "Generating"
    }

@router.get("/reports/{id}/download")
def download_report(id: str, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    # If file doesn't exist yet, generate it on demand
    file_ext = "pdf" if report.format.upper() == "PDF" else "csv"
    if not report.file_path or not os.path.exists(report.file_path):
        file_name = f"{report.id.lower()}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}.{file_ext}"
        file_path = settings.REPORTS_DIR / file_name
        
        if report.format.upper() == "PDF":
            generate_warehouse_pdf_report(
                file_path=file_path,
                report_title=report.name,
                report_type=report.type,
                created_by=report.created_by,
                date_str=report.date,
                include_charts=True
            )
        else:
            generate_warehouse_csv_report(
                file_path=file_path,
                report_title=report.name,
                report_type=report.type,
                created_by=report.created_by,
                date_str=report.date
            )
            
        report.file_path = str(file_path)
        report.status = "Ready"
        db.commit()
        
    media_type = "application/pdf" if file_ext == "pdf" else "text/csv"
    safe_name = "".join(c for c in report.name if c.isalnum() or c in (' ', '_', '-')).rstrip()
    download_filename = f"{safe_name.replace(' ', '_')}.{file_ext}"
    
    return FileResponse(
        path=report.file_path,
        media_type=media_type,
        filename=download_filename
    )

@router.delete("/reports/{id}")
def delete_report(id: str, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    if report.file_path and os.path.exists(report.file_path):
        try:
            os.remove(report.file_path)
        except OSError:
            pass
            
    db.delete(report)
    db.commit()
    return {"success": True, "id": id}
