from django.urls import path
from .views import home, search_form

urlpatterns = [
    path('', home, name='home'),
    path('search/form', search_form, name='search_form'),
]
