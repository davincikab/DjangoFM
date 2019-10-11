from django.shortcuts import render, redirect, get_object_or_404
from .models import FeatureBuilding, FeatureStreetLights,FeatureWaterPoint
from django.http import HttpResponse
from django.core.serializers import serialize
from django.template.loader import render_to_string
from django.contrib.gis.geos import GEOSGeometry, Point
from django.contrib.gis.measure import D
from django.db.models import Q
from .forms import *

# Create your views here.
def home(request):
    return render(request, 'index.html')

def kimathi_three_d(request):
    return render(request, 'kimathi_3d/index.html')

def building(request):
    build = serialize('geojson', FeatureBuilding.objects.all())
    return HttpResponse(build)

def street_light(request):
    street = serialize('geojson', FeatureStreetLights.objects.all())
    return HttpResponse(street)

def water_point(request):
    water_point = serialize('geojson', FeatureWaterPoint.objects.all())
    street = serialize('geojson', FeatureStreetLights.objects.all())

    lst = [water_point, street]
    return HttpResponse(lst[0])

def save_form_file(request, form, template_name):
    form_dict = dict()

    if request.method == 'POST':
        if form.is_valid():
            form.save()
            return redirect('home')
    return render(request, 'leaflet_form.html', {'form':form})

# look at render_to_string
def building_update(request, gid):
    building = get_object_or_404(FeatureBuilding, gid=gid)

    if request.method == 'POST':
        form = BuilldingForm(request.POST, instance=building)
    else:
        form = BuilldingForm(instance=building)

    return save_form_file(request, form, 'leaflet_form.html')

def street_light_update(request, gid):
    street = get_object_or_404(FeatureStreetLights, gid=gid)

    if request.method == 'POST':
        form = StreetLightForm(request.POST, instance=street)
    else:
        form = StreetLightForm(instance=street)

    return save_form_file(request, form, 'leaflet_form.html')

def water_light_update(request,gid):
    water = get_object_or_404(FeatureWaterPoint, gid=gid)

    if request.method == 'POST':
        form = WaterPointForm(request.POST,instance=water)
    else:
        form = WaterPointForm(instance=water)

    return save_form_file(request, form, 'leaflet_form.html')

def water_light_delete(request, gid):
    water = get_object_or_404(FeatureWaterPoint,gid=gid)

    if request.method == 'POST':
        water.delete()
        # water = FeatureWaterPoint.objects.all()
    else:
        water = water
    return render(request, 'feature_delete.html',{'water':water})

# Return a HttpResponse
def room_spatial_search(request):
    if request.method == 'GET':
        form = RoomSearchForm(request.GET)
        if form.is_valid():
            capacity = form.cleaned_data['capacity']
            room = FeatureBuilding.objects.filter(capacity__gte =int(capacity))
            data = serialize('geojson',room)
            return render(request,'about.html',{'data':data,'form':form})
    else:
        form = RoomSearchForm()
    data = serialize('geojson',FeatureBuilding.objects.all())

    return render(request,'about.html',{'form':form,'data':data})


def spatial_search(request):
    # form = SpatialSearchForm(request.GET)
    # obtain coordinates on geolocate: ajax request with the user location
    if request.method == 'GET':
        form = SpatialSearchForm(request.GET)
        if form.is_valid():
            distance = form.cleaned_data['distance']
            pnt = GEOSGeometry('POINT(36.95866 -0.39361)', srid=4326)
            output = serialize('geojson',FeatureWaterPoint.objects.filter(geom__distance_lt=(pnt, D(m=int(distance)))))
            return render(request,'index.html',{'data':output,'form':form})
    else:
        form = SpatialSearchForm()
    output = serialize('geojson',FeatureWaterPoint.objects.all())
    return render(request,'index.html',{'data':output,'form':form})

def simple_ajax_form(request):
    if request.method == 'GET':
        distance = request.GET.get('distance')
        position = request.GET.get('position')
        print(position)
        pnt = Point(float(position.lat),float(position.lng), srid=4326)
        output = serialize('geojson',FeatureWaterPoint.objects.filter(geom__distance_lt=(pnt, D(m=int(distance)))))
    return HttpResponse(output)
