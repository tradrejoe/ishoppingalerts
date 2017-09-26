getContentSupplies = function() {
	var buf = '<nav id="graphContent" style="position:relative;visiblity:hidden;">'+
		'<canvas id="hbar1" width="'+($('#app-content').width()-20)+'" height="'+($('#app-content').height()-20)+'">[No canvas support]</canvas>'+
		'</nav>';
	return buf;
}

getContentEdit = function() {
var buf =
' <nav id="frmAddContent" style="position:relative;visiblity:hidden;"><center>' +
'  <table width="90%"><tr><td colspan="2">&nbsp;</td></tr>'+
'  	<tr>'+
'  		<td align="right" style="color:#000099">Item:&nbsp;</td>'+
' 		<td align="left">'+
'    		<input name="medname" id="medname" value="" placeholder="Item Name" />'+
'    		<input name="oldname" id="oldname" value="" type="hidden"/>'+
'    	</td>'+
'   </tr><tr><td colspan="2">&nbsp;</td></tr>'+
'    <tr>'+
'	<td align="right" style="color:#000099;vertical-align:middle;"  valign="middle">Track Usage:&nbsp;</td>' +
'	<td align="left" valign="top" style="vertical-align:top;" >'+
'		<span class="toggle"><input id="talarm" onClick="toggleUsage();" type="checkbox"/></span>'+
'	</td>'+
'</tr>'+
'<tr>' +
'	<td colspan="2">&nbsp;</td>' +
'</tr>' + 
'<tr>' +
'	<td colspan="2">&nbsp;</td>' +
'</tr>' +
'<tr>'+
'    <td colspan="2"><div id="alertFields" style="padding:5px;visibility:hidden;border:1px solid #cccccc;border-radius:8px;">' +
'        <table width="100%" cellpadding="3">'+
'          	<tr>'+
'  		<td align="right" style="color:#000099">Consumption:&nbsp;</td>' +
'  		<td align="left">'+
'    		<input name="dosage" id="dosage" value="" placeholder="Consumption Amount" />'+
'    	</td>'+
'   </tr>'+
'   <tr>'+
'  		<td align="right" style="color:#000099">Refill:&nbsp;</td>' +
'  		<td align="left">'+
'    		<input name="refill" id="refill" value="" placeholder="Refill Amount"/>'+
'    	</td>'+
'   </tr>'+
'   <tr>'+
'  		<td align="right" style="color:#000099">Frequency:&nbsp;</td>' +
'  		<td align="left">'+
'			<select name="frequency" id="frequency" style="align:left;" placeholder="Frequency">'+
'				<option value="24">Daily</option>'+
'				<option value="48">Once Every Two Days</option>'+
'				<option value="72">Once Every Three Days</option>'+
'				<option value="96">Once Every Four Days</option>'+
'				<option value="120">Once Every Five Days</option>'+
'				<option value="144">Once Every Six Days</option>'+
'				<option value="168">Once A Week</option>'+
'				<option value="336">Once Every Two Weeks</option>'+
'				<option value="504">Once Every Three Weeks</option>'+
'				<option value="720">Once A Month</option>'+
'				<option value="2208">Once A Quarter</option>'+
'				<option value="8760">Once A Year</option>'+
'				<option value="1">Every Hour</option>'+
'				<option value="2">Every 2 Hours</option>'+
'				<option value="3">Every 3 Hours</option>'+
'				<option value="4">Every 4 Hours</option>'+
'				<option value="5">Every 5 Hours</option>'+
'				<option value="6">Every 6 Hours</option>'+
'				<option value="7">Every 7 Hours</option>'+
'				<option value="8">Every 8 Hours</option>'+
'				<option value="9">Every 9 Hours</option>'+
'				<option value="10">Every 10 Hours</option>'+
'				<option value="11">Every 11 Hours</option>'+
'				<option value="12">Every 12 Hours</option>'+
'				<option value="13">Every 13 Hours</option>'+
'				<option value="14">Every 14 Hours</option>'+
'				<option value="15">Every 15 Hours</option>'+
'				<option value="16">Every 16 Hours</option>'+
'				<option value="17">Every 17 Hours</option>'+
'				<option value="18">Every 18 Hours</option>'+
'				<option value="19">Every 19 Hours</option>'+
'				<option value="20">Every 20 Hours</option>'+
'				<option value="21">Every 21 Hours</option>'+
'				<option value="22">Every 22 Hours</option>'+
'				<option value="23">Every 23 Hours</option>'+
'				<option value="-1">Every Week Day</option>'+
'				<option value="-2">Every Week End</option>'+
'				<option value="48">Every Other Day</option>'+
'			</select>'+
'   	</td>'+
'   </tr>'+
'<tr>'+
'      	<td align="right" style="color:#000099">Alarm Level:&nbsp;</td>' +
'      	<td align="left" valign="middle" >'+
'      		<input id="alarm_level" value="30"/>%'+
'      	</td>'+
'</tr>'+
'   <tr>'+
'  		<td align="center" style="color:#000099" colspan="2" nowrap>Start&nbsp;'+
'			<select id="startingMonth">'+
'			 <option value="1">JAN</option>'+
'			 <option value="2">FEB</option>'+
'			 <option value="3">MAR</option>'+
'			 <option value="4">APR</option>'+
'			 <option value="5">MAY</option>'+
'			 <option value="6">JUN</option>'+
'			 <option value="7">JUL</option>'+
'			 <option value="8">AUG</option>'+
'			 <option value="9">SEP</option>'+
'			 <option value="10">OCT</option>'+
'			 <option value="11">NOV</option>'+
'			 <option value="12">DEC</option>'+
'			</select>/'+
'			<select id="startingDay" name="startingDay">'+
'			<option value="1">1</option>'+
'			<option value="2">2</option>'+
'			<option value="3">3</option>'+
'			<option value="4">4</option>'+
'			<option value="5">5</option>'+
'			<option value="6">6</option>'+
'			<option value="7">7</option>'+
'			<option value="8">8</option>'+
'			<option value="9">9</option>'+
'			<option value="10">10</option>'+
'			<option value="11">11</option>'+
'			<option value="12">12</option>'+
'			<option value="13">13</option>'+
'			<option value="14">14</option>'+
'			<option value="15">15</option>'+
'			<option value="16">16</option>'+
'			<option value="17">17</option>'+
'			<option value="18">18</option>'+
'			<option value="19">19</option>'+
'			<option value="20">20</option>'+
'			<option value="21">21</option>'+
'			<option value="22">22</option>'+
'			<option value="23">23</option>'+
'			<option value="24">24</option>'+
'			<option value="25">25</option>'+
'			<option value="26">26</option>'+
'			<option value="27">27</option>'+
'			<option value="28">28</option>'+
'			<option value="29">29</option>'+
'			<option value="30">30</option>'+
'			<option value="31">31</option>'+
'			</select>/'+
'			<select id="startingYear" name="startingYear">'+
'			 <option value="2011">11</option>'+
'			 <option value="2012">12</option>'+
'			 <option value="2013">13</option>'+
'			 <option value="2014">14</option>'+
'			 <option value="2015">15</option>'+
'			</select>&nbsp;'+
'		<select id="startingHour" name="startingHour">'+
'		 <option value="0">00</option>'+
'		 <option value="1">01</option>'+
'		 <option value="2">02</option>'+
'		 <option value="3">03</option>'+
'		 <option value="4">04</option>'+
'		 <option value="5">05</option>'+
'		 <option value="6">06</option>'+
'		 <option value="7">07</option>'+
'		 <option value="8">08</option>'+
'		 <option value="9">09</option>'+
'		 <option value="10">10</option>'+
'		 <option value="11">11</option>'+
'		 <option value="12">12</option>'+
'		 <option value="13">13</option>'+
'		 <option value="14">14</option>'+
'		 <option value="15">15</option>'+
'		 <option value="16">16</option>'+
'		 <option value="17">17</option>'+
'		 <option value="18">18</option>'+
'		 <option value="19">19</option>'+
'		 <option value="20">20</option>'+
'		 <option value="21">21</option>'+
'		 <option value="22">22</option>'+
'		 <option value="23">23</option>'+
'		</select>&nbsp;:&nbsp;'+
'	   <select id="startingMinute" name="startingMinute">'+
'			<option value="0">00</option>'+
'			<option value="1">01</option>'+
'			<option value="2">02</option>'+
'			<option value="3">03</option>'+
'			<option value="4">04</option>'+
'			<option value="5">05</option>'+
'			<option value="6">06</option>'+
'			<option value="7">07</option>'+
'			<option value="8">08</option>'+
'			<option value="9">09</option>'+
'			<option value="10">10</option>'+
'			<option value="11">11</option>'+
'			<option value="12">12</option>'+
'			<option value="13">13</option>'+
'			<option value="14">14</option>'+
'			<option value="15">15</option>'+
'			<option value="16">16</option>'+
'			<option value="17">17</option>'+
'			<option value="18">18</option>'+
'			<option value="19">19</option>'+
'			<option value="20">20</option>'+
'			<option value="21">21</option>'+
'			<option value="22">22</option>'+
'			<option value="23">23</option>'+
'			<option value="24">24</option>'+
'			<option value="25">25</option>'+
'			<option value="26">26</option>'+
'			<option value="27">27</option>'+
'			<option value="28">28</option>'+
'			<option value="29">29</option>'+
'			<option value="30">30</option>'+
'			<option value="31">31</option>'+
'			<option value="32">32</option>'+
'			<option value="33">33</option>'+
'			<option value="34">34</option>'+
'			<option value="35">35</option>'+
'			<option value="36">36</option>'+
'			<option value="37">37</option>'+
'			<option value="38">38</option>'+
'			<option value="39">39</option>'+
'			<option value="40">40</option>'+
'			<option value="41">41</option>'+
'			<option value="42">42</option>'+
'			<option value="43">43</option>'+
'			<option value="44">44</option>'+
'			<option value="45">45</option>'+
'			<option value="46">46</option>'+
'			<option value="47">47</option>'+
'			<option value="48">48</option>'+
'			<option value="49">49</option>'+
'			<option value="50">50</option>'+
'			<option value="51">51</option>'+
'			<option value="52">52</option>'+
'			<option value="53">53</option>'+
'			<option value="54">54</option>'+
'			<option value="55">55</option>'+
'			<option value="56">56</option>'+
'			<option value="57">57</option>'+
'			<option value="58">58</option>'+
'			<option value="59">59</option>'+
'		</select>'+
 ' 	</td>'+
  '</tr>'+
'        </table></div>'+
'    </td>'+
'</tr><tr><td colspan="2">&nbsp;</td></tr>' +
'<tr>'+
'<td align="center" nowrap><div id="btnEditSave" onclick="javascript:doUpdate();" style="cursor:pointer;-webkit-box-shadow: 0px -5px 5px #888 inset;padding:3px;border:1px solid #cccccc;width:90px;border-radius:8px;white-space:nowrap;height:32px;"><img src="images/save.png" style="float:left;"/><span style="font-size:13px;">Save</span></div></td>' +
'<td align="center" nowrap><div id="btnEditCancelDelete" onclick="javascript:doCancelDelete();" style="cursor:pointer;-webkit-box-shadow: 0px -5px 5px #888 inset;padding:3px;border:1px solid #cccccc;width:90px;border-radius:8px;white-space:nowrap;height:32px;"><img src="images/cancel.png" style="float:left;"/><span id="lblCancel" style="font-size:13px;">Cancel</span></div></td>'+
'</tr>' +
'</table>'+
'</nav>';
return buf;
}

getContentToolbar = function() {
var buf =
' <div id="toolbar" style="margin:0px;padding:0px;height:89px;width:100%;white-space:nowrap;text-align:center;">'+
'  <div id="btnmeds" onclick="javascript:showMeds();" style="background-image:-webkit-gradient(linear, 0% 0%, 0% 100%, from(#99CCFF), to(#081f6a));text-decoration:none;color:#fffff0;font-weight:700;float:left;margin:0px;display:table-cell;width:25%;border:none;height:89px;vertical-align:middle;text-align:center;">'+
'   <div style="margin:12px;vertical-align:middle;text-align:center;"><img src="images/csgHomePage.png" style="border:none;"/><br/>Home</div>'+
'  </div>'+
'   <div id="btnadd" onclick="javascript:showFrmAdd();" style="background-image:-webkit-gradient(linear, 0% 0%, 0% 100%, from(#99CCFF), to(#081f6a));text-decoration:none;color:#fffff0;font-weight:700;float:left;margin:0px;display:table-cell;width:25%;border:none;height:89px;vertical-align:middle;text-align:center;">'+
'    <div style="margin:12px;vertical-align:middle;text-align:center;"><img src="images/add.png" style="border:none;"/><br/><span id="lblEdit">Add</span></div>'+
'  </div>'+
'  <div id="btnsupply" onclick="javascript:showFrmSupplies();" style="background-image:-webkit-gradient(linear, 0% 0%, 0% 100%, from(#99CCFF), to(#081f6a));text-decoration:none;color:#fffff0;font-weight:700;float:left;margin:0px;display:table-cell;width:25%;border:none;height:89px;vertical-align:middle;text-align:center;" >'+
'   <div style="margin:12px;vertical-align:middle;text-align:center;"><img src="images/refill.png" style="border:none;"/><br/>Supplies</div>'+
'  </div>'+
'  <div id="btnrefill" onclick="javascript:doRefill();" style="background-image:-webkit-gradient(linear, 0% 0%, 0% 100%, from(#99CCFF), to(#081f6a));text-decoration:none;color:#fffff0;font-weight:700;float:left;margin:0px;display:table-cell;width:25%;border:none;height:89px;vertical-align:middle;text-align:center;" >'+
'   <div style="margin:12px;vertical-align:middle;text-align:center;"><img src="images/google_map.png" style="border:none;"/><br/>Shop</div>'+
'  </div></div>' +
' <div id="divwait" style="display:none;position:fixed"><img src="images/wait_animated.gif" /></div>' +
' <div id="divarrow" style="display:none;position:fixed;opacity:0.6;"><img src="images/upbluearrow.png" /></div>';
return buf;
}
69;
getContentHeader = function() {
var buf =
' <table id="titlebar" cellpadding="0" cellspacing="0" height="90px" width="100%" style="-webkit-box-shadow: 0px -5px 5px #888 inset;"><tr>' +
'  <td width="60" align="right" valign="middle">'+
'   <img src="images/iShoppingAlert57.jpg" />'+
'  </td>'+
'  <td align="left" valign="middle" nowrap style="font-size:26px;font-weight:700;font-family:"Times New Roman";color:#081f6a">' +
'   Shopping Alerts&nbsp;'+
'  </td>'+
'</tr></table>';
return buf;
}

getContentMain = function() {
var buf =
' <div id="content" style="top:100px;width:100%;height:297px;margin:0px;padding:0px;border-top:1px solid #cccccc;border-bottom:1px solid #cccccc;overflow:auto;">'+
' </div>';
return buf;
}