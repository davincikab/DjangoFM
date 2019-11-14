from django.contrib.gis import admin
from .models import FeatureBuilding, Timetable

class BuildingAdmin(admin.GeoModelAdmin):
    list_filter = ['block','level']
    list_display = ['name','block','use']

class TimetableAdmin(admin.ModelAdmin):
    list_filter = ('year','course')
    list_display = ['unit_code','unit_name','course','year']


admin.site.register(FeatureBuilding, BuildingAdmin);
admin.site.register(Timetable, TimetableAdmin);
# Register your models here.
"""
time = '16:00';
triggerThis = function() { alert('this was triggered'); };

  scheduleWarning(time, triggerThis) {

    // get hour and minute from hour:minute param received, ex.: '16:00'
    const hour = Number(time.split(':')[0]);
    const minute = Number(time.split(':')[1]);

    // create a Date object at the desired timepoint
    const startTime = new Date(); startTime.setHours(hour, minute);
    const now = new Date();

    // increase timepoint by 24 hours if in the past
    if (startTime.getTime() < now.getTime()) {
      startTime.setHours(startTime.getHours() + 24);
    }

    // get the interval in ms from now to the timepoint when to trigger the alarm
    const firstTriggerAfterMs = startTime.getTime() - now.getTime();

    // trigger the function triggerThis() at the timepoint
    // create setInterval when the timepoint is reached to trigger it every day at this timepoint
    setTimeout(function(){
      triggerThis();
      setInterval(triggerThis, 24 * 60 * 60 * 1000);
    }, firstTriggerAfterMs);

  }
"""
