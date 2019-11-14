from django.urls import path, include
from .views import register_view, profile
from django.contrib.auth.views import LoginView, LogoutView

urlpatterns = [
    path('login/', LoginView.as_view(template_name = 'user/login.html'),name='login'),
    path('logout/', LogoutView.as_view(template_name = 'user/logout.html'), name ='logout'),
    path('register/', register_view, name = 'register'),
    path('profile/',profile, name='profile')
]
