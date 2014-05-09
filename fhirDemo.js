console.log("fhirDemo.js :-)")

// starting a fhir from http://agrueneberg.github.io/FHIR-JS/fhir.min.js
var FHIR = require("fhir");
var fhir = new FHIR({
    url: "https://fhir.herokuapp.com",
});
fhir.credentials("username1", "username1");

// FHIR-Demo

fhirDemo = function () {
    // ini actions
    fhirDemo.UI();
};

fhirDemo.toJSON = function () { // convert text area HL7 text into JSON
    var hl7_txt = document.getElementById('divFHIRdemo_textArea').value;
    var hl7_json = hl72json(hl7_txt);
    var div = document.getElementById('divFHIRdemo_JSON');
    div.innerHTML = '<hr>JSON (using <a href="https://github.com/ibl/FHIR-Demo/blob/gh-pages/hl72json.js" target=_blank>hl72json.js</a>)<pre id="FHIRdemo_doc" style="color: green;">' + JSON.stringify(hl7_json, undefined, 1) + '</pre><button id="FHIRdemo_save_button">Save to FHIR</button>';
    var saveBtn = document.getElementById("FHIRdemo_save_button");
    saveBtn.onclick = function () {
        var doc = document.getElementById("FHIRdemo_doc").innerText;
        doc = JSON.parse(doc);
        fhirHl7Parser(doc, function () {
            refreshMessageList();
        });
    };
};

fhirDemo.UI = function () {
    var div0 = document.getElementById('divFHIRdemo');
    if (!div0) {
        alert('this demo expects to a hosting <div> with .id="divFHIRdemo"');
    } else {
        // input div
        var div = document.createElement('div');
        div0.appendChild(div);
        div.innerHTML = '<p style="color: navy;">Message list:</p><ul id="divFHIRdemo_messageList"></ul><p style="color: navy;">Paste HL7 text message, use <button id="FHIRdemo_button">demo</button>, <button id="FHIRdemoZGOV_button">with ZGOV</button>, or load it from a <i style="color: red;">.hl7</i> file:</p>';
        div.innerHTML += '<textarea style="width: 100%; height: 200px; color: blue;" id="divFHIRdemo_textArea">';
        refreshMessageList();
        var ta = document.getElementById('divFHIRdemo_textArea');
        ta.onkeyup = function (ev) {
            fhirDemo.toJSON(); // everytime a key is pressed
        };
        var upload = function (x) {
            var ta = document.getElementById('divFHIRdemo_textArea');
            ta.value = x.result;
            fhirDemo.toJSON();
        };
        var divUpload = document.createElement('div');
        div.appendChild(divUpload);
        jmat.inputFileTxt(upload, divUpload, '', 'accept=".hl7"');
        var bt = document.getElementById('FHIRdemo_button');
        bt.onclick = function () { // "demo" button
            var ta = document.getElementById('divFHIRdemo_textArea');
            ta.value = "MSH|^~\&|LAB||CDB||||ORU^R01|K172|P\nPID|||PATID1234^5^M11||Jones^William||19610613|M\nOBR||||80004^Electrolytes\nOBX|1|ST|84295^Na||150|mmol/l|136-148|Above high normal|||Final results\nOBX|2|ST|84132^K+||4.5|mmol/l|3.5-5|Normal|||Final results\nOBX|3|ST|82435^Cl||102|mmol/l|94-105|Normal|||Final results\nOBX|4|ST|82374^CO2||27|mmol/l|24-31|Normal|||Final results";
            fhirDemo.toJSON();
        };
        var btZ = document.getElementById('FHIRdemoZGOV_button');
        btZ.onclick = function () { // "with ZGOV" button
            var ta = document.getElementById('divFHIRdemo_textArea');
            ta.value = "MSH|^~\&|LAB||CDB||||ORU^R01|K172|P\nZGOV|read^username2^all|write^username2^self\nPID|||PATID1234^5^M11||Jones^William||19610613|M\nOBR||||80004^Electrolytes\nOBX|1|ST|84295^Na||150|mmol/l|136-148|Above high normal|||Final results\nOBX|2|ST|84132^K+||4.5|mmol/l|3.5-5|Normal|||Final results\nOBX|3|ST|82435^Cl||102|mmol/l|94-105|Normal|||Final results\nOBX|4|ST|82374^CO2||27|mmol/l|24-31|Normal|||Final results";
            fhirDemo.toJSON();
        };
        // Conversion to JSON
        var divJSON = document.createElement('div');
        divJSON.id = "divFHIRdemo_JSON";
        div0.appendChild(divJSON);
        // Setup user selector.
        var userSelectors = document.querySelectorAll("#FHIRdemo_changeUser a");
        for (var userSelectorIdx = 0; userSelectorIdx < userSelectors.length; userSelectorIdx++) {
            userSelectors[userSelectorIdx].onclick = function (evt) {
                fhir.credentials(evt.target.dataset.username, evt.target.dataset.password);
                refreshMessageList();
            };
        }
    }
};

refreshMessageList = function () {
    var ml = document.getElementById('divFHIRdemo_messageList');
 // Clear list.
    ml.innerHTML = "";
    fhir.search({
        _type: "MSH"
    }, function (err, resources) {
        var mlli;
        if (resources.length > 0) {
            resources.forEach(function (resource) {
                mlli = document.createElement("li");
                mlli.dataset.segment = JSON.stringify(resource);
                mlli.innerText = resource.mshid;
                mlli.onclick = function (evt) {
                    var message = JSON.parse(evt.target.dataset.segment);
                    fhirJsonParser(message, function (err, m) {
                        var ta = document.getElementById('divFHIRdemo_textArea');
                        ta.value = m;
                        fhirDemo.toJSON();
                    });
                };
                ml.appendChild(mlli);
            });
        } else {
            mlli = document.createElement("li");
            mlli.innerText = "No messages found.";
            ml.appendChild(mlli);
        }
    });
};

fhirHl7Parser = function (obj, callback) {
    var messageId;
 // Generate random message ID.
    messageId = Math.random().toString(36).substr(2, 9);
 // Parse other segments.
    async.map(obj, function (segment, callback) {
        var segmentType;
     // Determine segment type, this only support one at a time.
        Object.keys(segment).forEach(function (key) {
         // Handle embedded governance separately.
            if (key !== "@gov") {
                segmentType = key;
            }
        });
     // Persist segment.
        fhir.create(segmentType, {
            mshid: messageId,
            fields: segment[segmentType]
        }, function (err, res) {
         // React to embedded governance (if available).
            if (segment.hasOwnProperty("@gov") === true) {
                fhir.govwrite(res.type, res.id, segment["@gov"], function () {
                    callback(err, res);
                });
            } else {
                callback(err, res);
            }
        });
    }, function (err, res) {
        if (err) {
            console.error("An error occured while persisting the HL7 document.");
        } else {
            console.log("Documents were persisted:", res);
        }
        callback();
    });
};

fhirJsonParser = function (mshSegment, callback) {
 // Find other segments of the message based on mshid.
    fhir.search({
        mshid: mshSegment.mshid
    }, function (err, segments) {
        segments = segments.filter(function (segment) {
         // Ignore MSH segment duplicate.
            return segment._type !== "MSH";
        });
     // Prepend original MSH segment (it should be first).
        segments.unshift(mshSegment)
        async.map(segments, function (segment, callback) {
            var messageSegment = segment._type + "|";
            messageSegment += segment.fields.join("|");
         // Find and embed governance.
            fhir.govread(segment._type, segment._lid, function (err, gov) {
                if (gov.length > 0) {
                    messageSegment += "\n";
                    messageSegment += "ZGOV";
                    gov.forEach(function (rule) {
                        messageSegment += "|" + rule.operator + "^" + rule.username + "^" + rule.state;
                    });
                }
                callback(err, messageSegment);
            });
        }, function(err, segmentMessages) {
            callback(err, segmentMessages.join("\n"));
        });
    });
};
