from pydantic import BaseModel


class UserStatsResponse(BaseModel):
    total_users: int
    active_students: int
    active_faculty: int
    active_volunteers: int
    banned_users: int


class DonationAnalyticsResponse(BaseModel):
    total_donations: float
    donation_count: int
    average_donation: float
    monthly_breakdown: list[dict]  # {month: "2025-01", total: 5000}


class AdmissionAnalyticsResponse(BaseModel):
    total_applications: int
    pending: int
    approved: int
    rejected: int


class RecentActivityResponse(BaseModel):
    id: str
    action: str
    resource: str
    user: str | None
    timestamp: str


class DashboardStatsResponse(BaseModel):
    users: UserStatsResponse
    donations: DonationAnalyticsResponse
    admissions: AdmissionAnalyticsResponse
    recent_activity: list[RecentActivityResponse]