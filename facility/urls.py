from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('', home, name='home'),
    path('threed/',kimathi_three_d, name= 'three-d'),

    path('build/', building, name='build'),
    path('data/',data_layers, name= 'data'),
    
    # Water views CRUD
    path('water_update/<int:gid>/',water_light_update, name='water-update'),
    path('water_delete/<int:gid>/',water_light_delete, name='water-delete'),

    # Building CRUD
    path('building_update/<int:gid>/',building_update, name='build-update'),
    # path('building_delete/<int:gid>/',building_update, name='build-update'),
    # Building CRUD
    path('street_light_update/<int:gid>/',street_light_update, name='street-update'),

    # analysis
    path('analysis/', spatial_search, name='spatial-search'),
    path('room/', room_spatial_search, name='room-spatial-search'),
    path('ajax/', simple_ajax_form, name = 'ajax_form')
    # path('results/',output_filter, name='room-filter'),
]

if settings.DEBUG:
    urlpatterns+= static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
