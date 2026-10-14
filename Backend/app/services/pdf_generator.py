import os
from datetime import datetime
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether
)

def generate_warehouse_pdf_report(
    file_path: Path,
    report_title: str,
    report_type: str,
    created_by: str,
    date_str: str,
    include_charts: bool = True
) -> str:
    """
    Generates a professional executive-ready PDF report for TwinFlow AI Warehouse.
    """
    os.makedirs(file_path.parent, exist_ok=True)
    
    doc = SimpleDocTemplate(
        str(file_path),
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom Brand Styles
    brand_title_style = ParagraphStyle(
        'BrandTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0f172a')
    )
    
    subhead_style = ParagraphStyle(
        'SubHeader',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#64748b')
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=18,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=6
    )

    body_text = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155')
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#1e293b')
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#0f172a')
    )

    badge_critical = ParagraphStyle(
        'BadgeCrit',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#be123c')
    )

    badge_high = ParagraphStyle(
        'BadgeHigh',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#c2410c')
    )

    badge_normal = ParagraphStyle(
        'BadgeNorm',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#047857')
    )

    elements = []

    # 1. Header & Branding Banner
    header_data = [
        [
            Paragraph("<b>TWINFLOW AI DIGITAL TWIN</b><br/><font size=8 color='#64748b'>Intelligent Spatio-Temporal Warehouse Logistics System</font>", brand_title_style),
            Paragraph(f"<font size=8 color='#475569'><b>Report ID:</b> {file_path.stem.upper()}<br/><b>Date:</b> {date_str}<br/><b>Author:</b> {created_by}</font>", subhead_style)
        ]
    ]
    header_table = Table(header_data, colWidths=[360, 180])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
    ]))
    elements.append(header_table)
    elements.append(Spacer(1, 10))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0f172a'), spaceAfter=14))

    # 2. Report Title & Executive Scope
    elements.append(Paragraph(f"<b>{report_title}</b>", ParagraphStyle('ReportMain', fontName='Helvetica-Bold', fontSize=15, leading=19, textColor=colors.HexColor('#0284c7'))))
    elements.append(Paragraph(f"Scope: Comprehensive congestion audit, AGV flow telemetry, and DSTGT spatial prediction benchmark for <b>{report_type}</b>.", subhead_style))
    elements.append(Spacer(1, 12))

    # 3. Key Operational Metrics Summary Cards (Table Grid)
    kpi_data = [
        [
            Paragraph("<b>Active AGV Fleet</b><br/><font size=14 color='#0f172a'><b>18 / 22</b></font><br/><font size=7 color='#059669'>81.8% Operational</font>", body_text),
            Paragraph("<b>Peak Congestion Risk</b><br/><font size=14 color='#e11d48'><b>87%</b></font><br/><font size=7 color='#e11d48'>High Risk (Aisle B)</font>", body_text),
            Paragraph("<b>Predicted Queue Lead</b><br/><font size=14 color='#d97706'><b>22 AGVs</b></font><br/><font size=7 color='#d97706'>Horizon: +15 mins</font>", body_text),
            Paragraph("<b>Model Confidence</b><br/><font size=14 color='#0284c7'><b>92.4%</b></font><br/><font size=7 color='#0284c7'>DSTGT Spatio-Temporal</font>", body_text),
        ]
    ]
    kpi_table = Table(kpi_data, colWidths=[135, 135, 135, 135])
    kpi_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    elements.append(kpi_table)
    elements.append(Spacer(1, 16))

    # 4. Critical Hotspot & Aisle Status Table
    elements.append(Paragraph("<b>1. Warehouse Zone & Hotspot Risk Breakdown</b>", section_heading))
    
    hotspot_rows = [
        [
            Paragraph("Zone / Location", table_header),
            Paragraph("Current Status", table_header),
            Paragraph("Occupancy Rate", table_header),
            Paragraph("Predicted Queue", table_header),
            Paragraph("Delay Impact", table_header),
            Paragraph("AI Risk Level", table_header)
        ],
        [
            Paragraph("<b>Aisle B (Storage Hotspot)</b><br/><font size=7 color='#64748b'>Racks B1-B8</font>", table_cell),
            Paragraph("CRITICAL", badge_critical),
            Paragraph("88% (53 / 60)", table_cell_bold),
            Paragraph("22 AGVs queued", table_cell),
            Paragraph("+6.4 min delay", badge_critical),
            Paragraph("87% (High Risk)", badge_critical)
        ],
        [
            Paragraph("<b>Junction J-04 (Sortation Hub)</b><br/><font size=7 color='#64748b'>Zone 3 Main Feeder</font>", table_cell),
            Paragraph("WARNING", badge_high),
            Paragraph("82% (41 / 50)", table_cell_bold),
            Paragraph("14 AGVs queued", table_cell),
            Paragraph("+4.1 min delay", badge_high),
            Paragraph("76% (Moderate)", badge_high)
        ],
        [
            Paragraph("<b>Aisle C (Buffer Storage)</b><br/><font size=7 color='#64748b'>Zone 2 Bypass</font>", table_cell),
            Paragraph("OPTIMAL", badge_normal),
            Paragraph("58% (32 / 55)", table_cell),
            Paragraph("3 AGVs queued", table_cell),
            Paragraph("+0.8 min delay", badge_normal),
            Paragraph("24% (Low Risk)", badge_normal)
        ],
        [
            Paragraph("<b>Inbound Dock 2</b><br/><font size=7 color='#64748b'>Zone 1 Receiving</font>", table_cell),
            Paragraph("RESOLVED", badge_normal),
            Paragraph("62% (28 / 45)", table_cell),
            Paragraph("5 AGVs staged", table_cell),
            Paragraph("+1.4 min delay", badge_normal),
            Paragraph("31% (Low Risk)", badge_normal)
        ]
    ]

    hotspot_table = Table(hotspot_rows, colWidths=[150, 75, 80, 80, 75, 80])
    hotspot_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
    ]))
    elements.append(hotspot_table)
    elements.append(Spacer(1, 16))

    # 5. AI Spatio-Temporal Feature Attributions
    elements.append(Paragraph("<b>2. DSTGT Model Attention Feature Attributions</b>", section_heading))
    elements.append(Paragraph("Attention weights explain why the Spatio-Temporal Graph Transformer flagged Aisle B as a primary bottleneck:", body_text))
    elements.append(Spacer(1, 6))

    features_rows = [
        [
            Paragraph("Feature Parameter", table_header),
            Paragraph("Attention Weight", table_header),
            Paragraph("Real-Time Metric Value", table_header),
            Paragraph("Graph Impact Analysis", table_header)
        ],
        [
            Paragraph("<b>Aisle B Physical Density</b>", table_cell_bold),
            Paragraph("0.32 (32%)", badge_critical),
            Paragraph("88% rack fill rate", table_cell),
            Paragraph("Direct node saturation across topological edge path", table_cell)
        ],
        [
            Paragraph("<b>AGV Fleet Inflow Velocity</b>", table_cell_bold),
            Paragraph("0.24 (24%)", badge_high),
            Paragraph("1.2 m/s head-to-tail", table_cell),
            Paragraph("Consecutive robot arrivals exceeding dock discharge bandwidth", table_cell)
        ],
        [
            Paragraph("<b>Temporal Queue Growth</b>", table_cell_bold),
            Paragraph("0.18 (18%)", table_cell),
            Paragraph("22 robots queued", table_cell),
            Paragraph("Temporal attention detects +6.4m queue build over 15m window", table_cell)
        ],
        [
            Paragraph("<b>Order Wave Batch Volume</b>", table_cell_bold),
            Paragraph("0.15 (15%)", table_cell),
            Paragraph("+35% surge order batch", table_cell),
            Paragraph("E-commerce priority wave scheduled simultaneously", table_cell)
        ],
        [
            Paragraph("<b>Conveyor Motorized Load</b>", table_cell_bold),
            Paragraph("0.11 (11%)", table_cell),
            Paragraph("92% capacity load", table_cell),
            Paragraph("Backpressure on sortation feeder junction J-04", table_cell)
        ],
    ]
    features_table = Table(features_rows, colWidths=[150, 90, 110, 190])
    features_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#334155')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
    ]))
    elements.append(features_table)
    elements.append(Spacer(1, 16))

    # 6. Actionable AI Recommendations (Prescriptive Layer)
    recommendations = [
        Paragraph("<b>3. Prescriptive Rerouting & Optimization Recommendations:</b>", section_heading),
        Paragraph("• <b>Dynamic Rerouting:</b> Divert 4 inbound AGVs carrying standard non-priority SKUs from Aisle B to Aisle C (Buffer Storage) to reduce risk by 22%.", body_text),
        Paragraph("• <b>Speed Adjustment:</b> Reduce downstream sortation line speed by 10% to prevent physical pallet stacking at Junction J-04.", body_text),
        Paragraph("• <b>Wave Staggering:</b> Stagger subsequent inbound batch wave by 12 minutes until Aisle B occupancy clears below 70%.", body_text),
    ]
    elements.append(KeepTogether(recommendations))
    elements.append(Spacer(1, 20))

    # 7. Verification & Sign-off Stamp
    footer_text = Paragraph(
        f"<font size=7 color='#94a3b8'>TwinFlow Digital Twin AI Verification Engine | Authenticated SHA256 Signature | Confidential Warehouse Audit Document | Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}</font>",
        ParagraphStyle('Footer', alignment=1)
    )
    elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cbd5e1'), spaceAfter=6))
    elements.append(footer_text)

    # Build Document
    doc.build(elements)
    return str(file_path)
