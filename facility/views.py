from django.shortcuts import render, HttpResponseRedirect,redirect, get_object_or_404
from .models import *
from django.http import HttpResponse
from django.core.serializers import serialize
from django.template.loader import render_to_string
from django.contrib.gis.geos import GEOSGeometry, Point
from django.contrib.gis.measure import D
from django.db.models import Q
from .forms import *
import json
from django.contrib.auth.decorators import login_required, permission_required
# Create your views here.

@login_required
def home(request):
    return render(request, 'index.html')
@login_required
def dashboard(request):
    return render(request, 'dashboard_maintenance.html')

def kimathi_three_d(request):
    return render(request, 'kimathi_3d/index.html')

def building(request):
    # data = FeatureBuilding.objects.raw("SELECT * FROM building FULL OUTER JOIN timetable ON building.names = timetable.room_allocated;")
    build = serialize('geojson', FeatureBuilding.objects.all().prefetch_related('room_allocated'))
    return HttpResponse(build)

def related_data(request):
    data = FeatureBuilding.objects.all().prefetch_related('room_allocated')
    datar = [];
    for datum in data:
        datar.append({'name':datum.names,'related':serialize('json',datum.room_allocated.all())})
    return HttpResponse(json.dumps(datar))

def data_layers(request):
    seats = serialize('geojson',FeatureFieldSeats.objects.all())
    stpts = serialize('geojson',FeatureSittingPoints.objects.all())
    scp_blocks = serialize('geojson',FeatureScpblocks.objects.all())
    scp_roads = serialize('geojson', FeatureScpRoad.objects.all())
    forest_cover = serialize('geojson', FeatureForest.objects.all())
    water_point = serialize('geojson', FeatureWaterPoint.objects.all())
    coffee = serialize('geojson', FeatureCoffeePlantation.objects.all())
    road_data = serialize('geojson', Road.objects.all())
    street = serialize('geojson', FeatureStreetLights.objects.all())
    play = serialize('geojson', FeatureFootballPitch.objects.all())

    response = {'seats':seats,'stpts':stpts,'scp_blocks':scp_blocks,'scp_road':scp_roads,
            'forest_cover':forest_cover,'water_point':water_point,'coffee':coffee,
            'road':road_data,'street':street,'play':play}
    # response = [seats,stpts,scp_blocks]
    return HttpResponse(json.dumps(response))

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
            return HttpResponseRedirect('/')
    return render(request, template_name, {'form':form})

# look at render_to_string
@login_required
def building_update(request, gid):
    building = get_object_or_404(FeatureBuilding, gid=gid)

    if request.method == 'POST':
        form = BuilldingForm(request.POST, request.FILES, instance=building)
    else:
        form = BuilldingForm(instance=building)

    return save_form_file(request, form, 'building_form.html')

@login_required
def street_light_update(request, gid):
    street = get_object_or_404(FeatureStreetLights, gid=gid)

    if request.method == 'POST':
        form = StreetLightForm(request.POST, instance=street)
    else:
        form = StreetLightForm(instance=street)

    return save_form_file(request, form, 'leaflet_form.html')

@login_required
def water_light_update(request,gid):
    water = get_object_or_404(FeatureWaterPoint, gid=gid)

    if request.method == 'POST':
        form = WaterPointForm(request.POST,instance=water)
    else:
        form = WaterPointForm(instance=water)

    return save_form_file(request, form, 'leaflet_form.html')

@login_required
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
        data = position.split(',')
        pnt = Point(float(data[0]),float(data[1]), srid=4326)
        output = serialize('geojson',FeatureWaterPoint.objects.filter(geom__distance_lt=(pnt, D(m=int(distance)))))
    return HttpResponse(output)

def disaster_analysis(request):
    pass

def space_management(request):
    pass

def security_status(request):
    pass

def maintenace_reports(request):
    pass
