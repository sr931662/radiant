from .auth_routes import router as auth_router
from .user_routes import router as user_router
from .membership_routes import public_router as membership_router, admin_router as admin_membership_router
from .fdp_routes import public_router as fdp_router, admin_router as admin_fdp_router
from .admission_routes import public_router as admission_router, admin_router as admin_admission_router
from .donation_routes import public_router as donation_router, admin_router as admin_donation_router
from .course_routes import public_router as course_router, admin_router as admin_course_router
from .certificate_routes import public_router as certificate_router, admin_router as admin_certificate_router
from .gallery_routes import public_router as gallery_router, admin_router as admin_gallery_router
from .volunteer_routes import public_router as volunteer_router, admin_router as admin_volunteer_router
from .blog_routes import public_router as blog_router, admin_router as admin_blog_router
from .contact_routes import public_router as contact_router, admin_router as admin_contact_router
from .download_routes import public_router as download_router, admin_router as admin_download_router
from .dashboard_routes import router as dashboard_router
from .public_routes import router as public_router