from typing import List
from pydantic import BaseModel

class InfluentialFeature(BaseModel):
    name: str
    weight: float
    color: str

class ModelInfo(BaseModel):
    name: str
    lastTrainedDate: str
    trainingDataSize: str
    accuracy: float
    f1Score: float
    mae: str

class PredictionLiveResponse(BaseModel):
    congestionProbability: int
    bottleneckLocation: str
    queueLength: int
    queueHorizonMin: int
    delayTime: float
    confidence: int
    riskLabel: str
    updatedSecondsAgo: int
    influentialFeatures: List[InfluentialFeature]
    modelInfo: ModelInfo

class RetrainResponse(BaseModel):
    success: bool
    jobId: str
    status: str
    etaSeconds: int
