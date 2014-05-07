console.log("fhirDemo.js :-)")

// starting a fhir from http://agrueneberg.github.io/FHIR-JS/fhir.min.js
var FHIR = require("fhir");
var fhir = new FHIR({
    url: " https://fhir.herokuapp.com",
});

// FHIR-Demo

fhirDemo=function(){
    // ini actions
    fhirDemo.UI();
}

fhirDemo.toJSON=function(){ // convert text area HL7 text into JSON
    var hl7_txt = document.getElementById('divFHIRdemo_textArea').value;
    var hl7_json = hl72json(hl7_txt);
    var div = document.getElementById('divFHIRdemo_JSON');
    div.innerHTML='<hr>JSON (using <a href="https://github.com/ibl/FHIR-Demo/blob/gh-pages/hl72json.js" target=_blank>hl72json.js</a>)<pre style="color:green">'+JSON.stringify(hl7_json,undefined,1)+'</pre>';
    4
}

fhirDemo.UI=function(){
    var div0=document.getElementById('divFHIRdemo');
    if(!div0){alert('this demo expects to a hosting <div> with .id="divFHIRdemo" ')}
    else{
        // input div
        var div = document.createElement('div');
        div0.appendChild(div);
        div.innerHTML='<p style="color:navy">Paste HL7 text message, use <button id="FHIRdemo_button">demo</button>, <button id="FHIRdemoZGOV_button">with ZGOV</button>, or load it from a <i style="color:red">.hl7</i> file:</p>';
        div.innerHTML+='<textarea style="width:100%;height:200;color:blue" id="divFHIRdemo_textArea">';
        var ta = document.getElementById('divFHIRdemo_textArea');
        ta.onkeyup=function(ev){
            //if(ev.keyCode==13){fhirDemo.toJSON()} // onlu when enter is pressed
            fhirDemo.toJSON(); // everytime a key is pressed
        }
        var upload =function(x){
            var ta = document.getElementById('divFHIRdemo_textArea');
            ta.value=x.result;
            fhirDemo.toJSON();
        }
        var divUpload = document.createElement('div');div.appendChild(divUpload);
        jmat.inputFileTxt(upload,divUpload,'','accept=".hl7"');
        var bt = document.getElementById('FHIRdemo_button');
        bt.onclick=function(){ // "demo" button
            var ta = document.getElementById('divFHIRdemo_textArea');
            ta.value="MSH|^~\&|LAB||CDB||||ORU^R01|K172|P\nPID|||PATID1234^5^M11||Jones^William||19610613|M\nOBR||||80004^Electrolytes\nOBX|1|ST|84295^Na||150|mmol/l|136-148|Above high normal|||Final results\nOBX|2|ST|84132^K+||4.5|mmol/l|3.5-5|Normal|||Final results\nOBX|3|ST|82435^Cl||102|mmol/l|94-105|Normal|||Final results\nOBX|4|ST|82374^CO2||27|mmol/l|24-31|Normal|||Final results";
            fhirDemo.toJSON();
        }
        var btZ = document.getElementById('FHIRdemoZGOV_button');
        btZ.onclick=function(){ // "with ZGOV" button
            var ta = document.getElementById('divFHIRdemo_textArea');
            ta.value="MSH|^~\&|LAB||CDB||||ORU^R01|K172|P\nZGOV|read^username1^all|write^username1^self\nPID|||PATID1234^5^M11||Jones^William||19610613|M\nOBR||||80004^Electrolytes\nOBX|1|ST|84295^Na||150|mmol/l|136-148|Above high normal|||Final results\nOBX|2|ST|84132^K+||4.5|mmol/l|3.5-5|Normal|||Final results\nOBX|3|ST|82435^Cl||102|mmol/l|94-105|Normal|||Final results\nOBX|4|ST|82374^CO2||27|mmol/l|24-31|Normal|||Final results";
            fhirDemo.toJSON();
        }
        // Conversion to JSON
        var divJSON = document.createElement('div');
        divJSON.id="divFHIRdemo_JSON"
        div0.appendChild(divJSON);
        
    }
    //jmat.inputFileTxt(this.parseGPScvsHTML,div1,'<span style="color:blue">Upload .cvs file generated by gps.wustl.edu</span>','accept=".hl7"');
    
}