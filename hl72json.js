console.log('hl72json.js :-)')

// related documentation:
// http://www.mieweb.com/wiki/images/3/30/Logician_HL7_Specs_Document.pdf
// http://www.mass.gov/eohhs/docs/dph/cdc/immunization/miis-hl7-transfer-specs.pdf
// http://www.hl7.org/implement/standards/fhir/json.html
// https://www.youtube.com/watch?v=Wyp_4XgzP7A  << intro to HL7 video
// http://www.interfaceware.com/example_hl7_message.html << intro to HL7 text

hl72json=function(txt){
	// regular parsing
	txt = txt.split(/[\n\r]/).filter(function(x){
		return x !== "";
	}).map(function(x){
		return x.split('|')
	});
	txt = txt.map(function(x){
		var y = {};
		y[x[0]] = x.slice(1).map(function(xi){
			if(xi.match(/^[^\^]+\^/)){
				xi=xi.split('^');
			}
			return xi
		});
		return y;
	})
	// look for ZGOV segments and associate them to the preceding segment object
	for(i=txt.length-1 ; i>0 ; i--){
		if(Object.getOwnPropertyNames(txt[i])[0]==="ZGOV"){
			txt[i].ZGOV = txt[i].ZGOV.map(function(z){
				//z = z.split('^');
				if(typeof(z)=='string'){z=[z,'','']}
				return {
					operator:z[0],
					username:z[1],
					state:z[2]
				}
			})
			txt[i-1]['@gov']=txt[i]['ZGOV'];
			txt.splice(i,1);
		}
		
		4
	}
	return txt;
}
