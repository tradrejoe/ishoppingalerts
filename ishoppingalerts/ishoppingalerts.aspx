<%@ page language="C#" autoeventwireup="true" CodeFile="iShoppingAlerts.aspx.cs" inherits="uxlcorp.iShoppingAlerts" %>

<%  
    if (!ShowForm)
   { %>
    <form id="frmiMedAlert" runat="server">
    <div>
    <span style="font-style:italic;font-weight:700;text-decoration:underline">
        iShoppingAlerts</span>
        <ul>
    <% foreach(String key in Request.Params.Keys) {
         %><li><%=key%>:<%=Request.Params[key]%></li><% 
       }
                                              
    %>
    </ul>
    </div>
    </form>
<%}
   else
   { %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">

<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="Expires" value="0">
<meta name="Pragma" value="no-cache">
<meta name="cache-control" value="no-cache">

<title>Shopping Alert</title>
<link href="https://www.google.com/uds/css/gsearch.css" rel="stylesheet" type="text/css"/>
<link href="css/ext-all-uxl.css" rel="Stylesheet" type="text/css" />
<style type="text/css">
 nav {
  display: block;
  height: 100%;
  -webkit-perspective: 1000;
  -webkit-backface-visibility: hidden;
 }
 .toggle input[type="checkbox"]:checked
 {
  background-position: 0px 0px;
 }
 .toggle input[type="checkbox"]
 {
  -webkit-appearance: textarea;
  -webkit-transition: background-position 0.15s;
  background: white url(images/toggleSwitch.png) no-repeat -55px 0px;
  border-bottom-left-radius: 5px 5px;
  border-bottom-right-radius: 5px 5px;
  border: ;
  border-top-left-radius: 5px 5px;
  border-top-right-radius: 5px 5px;
  height: 27px;
  margin: 0px;
  overflow: hidden;
  position: absolute;
  width: 94px;
 }

</style>
<script src="scripts/templates.js" type="text/javascript"></script>
<script src="scripts/jquery-1.6.2.min.js" type="text/javascript" charset="UTF-8"></script>
<script src="scripts/touch-scroll.min.js" type="text/javascript" charset="UTF-8"></script>
<script src="scripts/ext-all-uxl.js" type="text/javascript"></script>
<script src="scripts/hibernate.js" type="text/javascript" charset="UTF-8"></script>
<script src="scripts/RGraph.common.core.js" type="text/javascript" charset="UTF-8"></script>
<script src="scripts/RGraph.common.tooltips.js" type="text/javascript" charset="UTF-8"></script>
<script src="scripts/RGraph.hbar.js" type="text/javascript" charset="UTF-8"></script>
<script type="text/javascript">
    var HOUR = 1000 * 60 * 60;
    var opmode = "";
    function med(medname, dosage, unit, frequency, refill, remaining, starting, alarm, alarm_level) {
        this.medname = medname;
        this.dosage = dosage;
        this.unit = unit;
        this.frequency = frequency;
        this.refill = refill;
        this.remaining = remaining;
        this.starting = starting;
        this.alarm = alarm;
        this.alarm_level = alarm_level;

        this.toString = function () {
            var buf = "";
            for (var prp in this) {
                if (typeof this[prp] !== 'function')
                    buf += prp + "=" + this[prp] + ";"
            }
            return buf;
        }

        this.getSqlCreate = function () {
            return "CREATE TABLE IF NOT EXISTS medicine (medname TEXT NOT NULL PRIMARY KEY, " +
			  "dosage FLOAT NOT NULL DEFAULT 1, unit TEXT, frequency FLOAT NOT NULL DEFAULT 24, refill FLOAT NOT NULL DEFAULT 100, " +
			  "remaining FLOAT, starting FLOAT NOT NULL, alarm TEXT, alarm_level FLOAT)";
        }

        this.getRemaining = function () {
            var today = (new Date()).getTime();
            var vdate = this.starting;
            var vdosage = this.dosage;
            var vrefill = this.refill;
            if (vrefill <= 0) return 0;
            var tmprmn = vrefill;
            var vfrequency = this.frequency;
            if (vdate >= today) return 100;
            while (today >= vdate) {
                var vtaken = true;
                switch (vfrequency) {
                    case -1:
                    case -2:
                        vdate += HOUR * 24;
                        break;
                    default:
                        vdate += HOUR * vfrequency;
                        break;
                }
                if (today >= vdate) {
                    var vdayofweek = (new Date(vdate)).getDay();
                    switch (vfrequency) {
                        case -1: //week days
                            if (vdayofweek == 0 || vdayofweek == 6)
                                vtaken = false;
                            break;
                        case -2: //week ends
                            if (vdayofweek >= 1 && vdayofweek <= 5)
                                vtaken = false;
                            break;
                        default:
                            break;
                    }
                }
                if (vtaken) tmprmn -= vdosage;
                if (tmprmn <= 0) return 0;

            }
        }

        this.getKeyFields = function () {
            return ['medname'];
        }

        return this;
    }

    var session = JSSessionFactory.getSession();

    init = function (cnt) {
        try {
            if (cnt && cnt.length > 0 && cnt.attr('id') == 'frmMeds') cnt.touchScroll();
        } catch (err) {
            if (console && err && err.description) console.write("init(), error: " + err.description);
        }
        $(document).bind('touchmove', notouchmove);
        $(':input').bind('blur', function (evt) {
            $(document).scrollTop(0);
        });
        $(document).scrollTop(0);
    }

    highlightButton = function (idx) {
        var tmparbtn = [$('#btnmeds'), $('#btnadd'), $('#btnsupply'), $('#btnrefill')];
        for (var i = 0; i < tmparbtn.length; i++) {
            tmparbtn[i].css('opacity', i == idx ? '0.6' : '1.0');
        }
        var pos = tmparbtn[idx].position(); var arrow = $('#divarrow');
        arrow.css({ 'top': $('#app-footer').position().top - arrow.height() + 4, 'left': pos.left + (tmparbtn[idx].width() - arrow.width()) / 2, 'display': 'inline' });
    }

    notouchmove = function (event) {
        var e = event || window.event;
        e.preventDefault();
    }


    noLocation = function () { $('#divwait').css('display', 'none'); }

    drawHistGram = function (arrmn, arlbl) {
        var hbar1 = new RGraph.HBar('hbar1', arrmn);

        var grad = hbar1.context.createLinearGradient(0, 0, 100, 100);
        grad.addColorStop(0, 'white');
        grad.addColorStop(1, 'blue');

        hbar1.Set('chart.strokestyle', 'rgba(0,0,0,0)');
        hbar1.Set('chart.gutter.left', 100);
        hbar1.Set('chart.gutter.right', 0);
        hbar1.Set('chart.gutter.top', 30);
        hbar1.Set('chart.gutter.bottom', 0);
        hbar1.Set('chart.background.grid.autofit', true);
        hbar1.Set('chart.title', 'Supplies');
        hbar1.Set('chart.labels', arlbl);
        hbar1.Set('chart.shadow', true);
        hbar1.Set('chart.shadow.color', 'gray');
        hbar1.Set('chart.shadow.offsetx', 0);
        hbar1.Set('chart.shadow.offsety', 0);
        hbar1.Set('chart.shadow.blur', 15);
        hbar1.Set('chart.colors', [grad]);
        hbar1.Draw();
    }

    var lstMeds = '';

    showMeds = function () {
        opmode = "";
        session.find(new med(), 'medicine', null, null,
         function (rs) {
             var buf = '';
             if (rs.length > 0) {
                 lstMeds = '';
                 buf = '<nav id="frmMeds" style="position:relative;visiblity:hidden;"><table border="0" width="100%" cellspacing="0" cellpadding="0">';
                 for (var i = 0; i < rs.length; i++) {
                     var rec = rs[i];
                     lstMeds += (rec.medname + ',');
                     var tmprmn = parseFloat(rec['remaining']);
                     var tmpalrml = parseFloat(rec['alarm_level']);
                     var bshowalarm = tmprmn != 0 && tmpalrml != 0 && tmprmn <= tmpalrml;
                     buf += '<tr style="border-bottom:1px solid #b5c1c9;" onclick="javascript:showFrmEdit(\'' + rec['medname'] + '\');">' +
                     	'<td style="border-bottom:1px solid #99CCFF;">' + (bshowalarm ? '<img src="images/bell.png"/>' : '&nbsp;') + '</td>' +
                        '<td width="75%" style="border-bottom:1px solid #99CCFF;vertical-align:middle;"><br/>' + rec['medname'] + '<br/><br/></td>' +
                        '<td style="border-bottom:1px solid #99CCFF;"><img src="images/arrow.png"/></td></tr>\n';
                 }
                 if (rs.length > 0) lstMeds = rs[0].medname + '';
                 buf += "</table></nav>";
             } else {
                 buf = '<nav id="frmMeds" style="position:relative;visiblity:hidden;"><div style="color:#99CCFF;width:100%;text-align:center;">No record found. Click "add new" button to add new medicine.</div></nav>';
             }
             if ($('#app-content') && $('#app-content').length > 0) {
                 replace({ items: [{ html: buf }] }, 'app-content');
                 init($('#frmMeds'));
                 $('#lblEdit').html('&nbsp;&nbsp;Add');
                 highlightButton(0);
                 animPanel('#app-content', 'frmMeds');
             }
         });
    }

    preHistGram = function () {
        opmode = "";
        session.find(new med(), 'medicine', null, null,
         function (rs) {
             var buf = '', arrmn = new Array(), arlbl = new Array();
             if (rs.length > 0) {
                 for (var i = 0; i < rs.length; i++) {
                     var rec = rs[i];
                     var pcnt = 10;
                     pcnt = parseInt(rec['remaining']);
                     if (isNaN(pcnt)) pcnt = 10;
                     arrmn.push(pcnt);
                     arlbl.push(rec['medname'] + ' (' + pcnt + ')');
                 }
             }
             drawHistGram(arrmn, arlbl);
         });
        init(null);
    }

    showFrmAdd = function () {
        opmode = "add";
        replace({ items: [{ html: getContentEdit() }] }, 'app-content');
        init($('#frmAddContent'));
        setDate(new Date());
        $('#lblCancel').html('&nbsp;&nbsp;Cancel');
        $('#lblEdit').html('&nbsp;&nbsp;Add');
        highlightButton(1);
        animPanel('#app-content', 'frmAddContent');
    }
    var gMedName = '';
    showFrmEdit = function (medname) {
        opmode = "edit";
        gMedName = medname;
        replace({ items: [{ html: getContentEdit() }] }, 'app-content');
        $('#medname').focus();
        $('#lblCancel').html('&nbsp;&nbsp;&nbsp;Delete');
        session.load(new med(medname), 'medicine', null, function (amed) {
            setMed(amed);
        });
        init($('#frmAddContent'));
        $('#lblEdit').html('&nbsp;&nbsp;Edit');
        highlightButton(1);
        animPanel('#app-content', 'frmAddContent');
    }

    showFrmSupplies = function () {
        replace({ items: [{ html: getContentSupplies() }] }, 'app-content');
        preHistGram();
        init($('#graphContent'));
        highlightButton(2);
        animPanel('#app-content', 'graphContent');
    }

    doUpdate = function () {
        var med = getMed();
        if (med) {
            if (opmode == "add")
                session.add(med, 'medicine', null);
            else
                session.edit(med, 'medicine', null, [$('#oldname').val()]);
            showMeds();
        }
    }

    doCancelDelete = function () {
        if (opmode == "edit") {
            //remove
            var med = getMed();
            session.remove(med, 'medicine', null);
        }
        showMeds();
    }

    ltrim = function (srch) {
        return srch.replace(/^([\s]*)(\S)/, '$2');
    }
    rtrim = function (srch) {
        return srch.replace(/(\S)([\s]*)$/, '$1');
    }
    trim = function (srch) {
        return ltrim(rtrim(srch));
    }
    isNumeric = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    getMed = function () {
        var tmpname = $('#medname').val();
        if (trim(tmpname) == '') {
            alert('Please enter item name.');
            $('#medname').focus();
            return null;
        }
        var valarm = document.getElementById('talarm').checked ? 'y' : 'n';
        var tmprefill = 0;
        var tmpdosage = 0;
        var tmpdt = getDate();
        var tmpalvl = 30;
        if (valarm == 'y') {
            if (!isNumeric($('#dosage').val())) {
                alert('Please enter a number for the unit of consumption.');
                $('#dosage').focus();
                return null;
            }
            if (!isNumeric($('#refill').val())) {
                alert('Please enter a number for the refill amount.');
                $('#refill').focus();
                return null;
            }
            tmprefill = parseFloat($('#refill').val());
            tmpdosage = parseFloat($('#dosage').val());
            if (tmprefill < tmpdosage) {
                alert('Refill amount must be greater than the amount of unit of consumption.');
                $('#refill').focus();
                return null;
            }
            if (!isNumeric($('#alarm_level').val())) {
                alert('Please enter a number for the alarm level, between 10 to 90 percent.');
                $('#alarm_level').focus();
                return null;
            }
            tmpalvl = parseFloat($('#alarm_level').val());
            if (tmpalvl < 10 || tmpalvl > 90) {
                alert('Please enter a number for the alarm level, between 10 to 90 percent.');
                $('#alarm_level').focus();
                return null;
            }
        }
        var tmpmed = new med(tmpname, tmpdosage, '', $('#frequency').val(), tmprefill, 100, tmpdt, valarm, tmpalvl);
        tmpmed['remaining'] = tmpmed.getRemaining();
        return tmpmed;
    }

    setMed = function (amed) {
        if (amed == null) return;
        try { $('#medname').val(amed.medname); } catch (err) { }
        try { $('#oldname').val(amed.medname); } catch (err) { }
        try { $('#dosage').val(amed.dosage); } catch (err) { }
        try { $('#unit').val(amed.unit); } catch (err) { }
        try { $('#frequency').val(amed.frequency); } catch (err) { }
        try { $('#refill').val(amed.refill); } catch (err) { }
        try { $('#alarm_level').val(amed.alarm_level); } catch (err) { }
        try {
            document.getElementById('talarm').checked = (amed.alarm == 'y');
            $('#alertFields').css('visibility', amed.alarm == 'y' ? 'visible' : 'hidden');
        } catch (err) { }
        try { setDate(new Date(amed.starting)); } catch (err) { }
    }

    setDate = function (dt) {
        try { $('#startingMonth').val(dt.getMonth() + 1); } catch (err) { }
        try { $('#startingDay').val(dt.getDate()); } catch (err) { }
        try { $('#startingYear').val(dt.getFullYear()); } catch (err) { }
        try { $('#startingHour').val(dt.getHours()); } catch (err) { }
        try { $('#startingMinute').val(dt.getMinutes()); } catch (err) { }
    }
    getDate = function () {
        var retdt = new Date();
        try {
            retdt = new Date(
        		parseInt($('#startingYear').val()),
        		(parseInt($('#startingMonth').val()) - 1),
        		parseInt($('#startingDay').val()),
        		parseInt($('#startingHour').val()),
        		parseInt($('#startingMinute').val())
        		);
        } catch (err) { }
        return retdt;
    }

    doRefill = function () {
        var div = $('#divwait');
        div.css({
            'top': ($(window).height() - div.height()) / 2 + $(document).scrollTop(),
            'left': ($(document).width() - div.width()) / 2,
            'display': 'inline'
        });
        navigator.geolocation.getCurrentPosition(doRefillCallback, noLocation);
        highlightButton(3);
    }

    doRefillCallback = function (pos) {
        var qry = opmode != '' ? gMedName : lstMeds
        var h = $('#app-content').height();
        qry += '&h=' + h;
        var tmpsrc = '<iframe onload="javascript:hidewait();" frameborder="0" height="' + h + 'px;" width="100%" src="iShop.aspx?qry=' + qry +
        '&lat=' + pos.coords.latitude + '&lng=' + pos.coords.longitude + '"></iframe>';
        replace({ items: [{ html: tmpsrc }] }, 'app-content');
    }

    hidewait = function () { $('#divwait').css('display', 'none'); }
    var currpos;

    $(document).ready(function () {
        createViewport();
    });

    replace = function (config, id) {
        try {
            var btns = Ext.getCmp(id);
            btns.removeAll();
            btns.add(Ext.apply(config));
            btns.doLayout();
        } catch (err) {
            if (console) console.log('main_js::replace() - error while replacing content: ' + err.description);
        }
    }

    toggleUsage = function () {
        try { $("#alertFields").css("visibility", $("#talarm").prop("checked") ? "visible" : "hidden"); }
        catch (err) { if (console) console.log('main_js::toggleUsage() - error: ' + err.description); }
    }

    animPanel = function (cnt, pnl) {
        var pr = $(cnt).width(); var pb = $(cnt).height();
        Ext.create('Ext.fx.Anim', {
            target: pnl, duration: 500,
            from: { width: 0, height: 0, left: pr * (Math.random() > 0.5 ? -1 : 1), top: pb * (Math.random() > 0.5 ? -1 : 1) },
            to: { width: pr, height: pb, left: 0, top: 0, visible: true }
        });
    }

    createViewport = function () {
        var strHeader = getContentHeader();
        var strFooter = getContentToolbar();
        Ext.require(['*']);
        //var cw;		
        Ext.create('Ext.Viewport', {
            layout: {
                type: 'border',
                padding: 0
            },
            defaults: {
                split: false
            },
            items: [
				    {
				        id: 'app-header',
				        region: 'north', xtype: 'panel', border: false, frame: false, split: false, height: 90, maxHeight: 90,
				        items: [{ html: strHeader }]
				    },
				    {
				        id: 'app-content',
				        region: 'center', xtype: 'panel', border: false, frame: false, split: false, width: '100%', padding: 0, margin: 0,
				        items: [{ html: '' }]
				    },
				    {
				        id: 'app-footer',
				        region: 'south', xtype: 'panel', collapsible: false, split: false, height: 89, maxHeight: 89, frame: false,
				        border: false, layout: { padding: 0, margin: 0 },
				        items: [{ html: strFooter }]
				    }],
            listeners: {
                afterlayout: function () {
                    showMeds();
                    init($('#navProductsList'));
                }
            }
        });
    }


    window.onload = function () {
        console.log("ishoppingalerts app loaded...");
        if (location.protocol != 'https:') {
            location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
        }
    }
</script>
</head>

<body style="padding:0px;margin:0px;">

</body>
</html>
<%} %>

