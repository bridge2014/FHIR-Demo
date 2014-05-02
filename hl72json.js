console.log('hl72json.js :-)')

// related documentation:
// http://www.mieweb.com/wiki/images/3/30/Logician_HL7_Specs_Document.pdf
// http://www.mass.gov/eohhs/docs/dph/cdc/immunization/miis-hl7-transfer-specs.pdf
// http://www.hl7.org/implement/standards/fhir/json.html
// 

hl72json=function(txt){
	txt = txt.split(/\n/).map(function(x){return x.split('|')});
	txt = txt.map(function(x){
		var y = {};
		y[x[0]] = x.slice(1);
		return y;
	})
	return txt;
}