function GetMultiLine(sStr)
{
	var s = sStr;
	s = s.replace(/function/, '');
	s = s.replace(/\(\)/, '');
	s = s.replace(/\{/, '');
	s = s.replace(/\}/, '');
	s = s.replace(/\/\*/, '');
	s = s.replace(/\*\//, '');
	return s;
}