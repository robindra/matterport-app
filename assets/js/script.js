const graphURL = 'https://api.matterport.com/api/models/graph';
const authToken = 'Basic 52f65fce1ca7a9b9:a8d1b330a235097ba404fc05e7ef809b';
var selectedFile;
document
    .getElementById("fileUpload")
    .addEventListener("change", function(event) {
    selectedFile = event.target.files[0];
    });
document
    .getElementById("uploadExcel")
    .addEventListener("click", function() {
    if (selectedFile) {
        var fileReader = new FileReader();
        fileReader.onload = function(event) {
            var data = event.target.result;

            var workbook = XLSX.read(data, {
                type: "binary"
            });
            workbook.SheetNames.forEach(sheet => {
                let rowObject = XLSX.utils.sheet_to_row_object_array(
                workbook.Sheets[sheet]
                );
                let jsonObject = JSON.stringify(rowObject);
                document.getElementById("jsonData-original").innerHTML = jsonObject;

                const cloneJson = jsonObject.slice();
                const concatData = JSON.parse(cloneJson).map(item => {
                return {
                    [item.product]: item.product,
                    [item.id]: `${item.product} ${item.type} ${item.model}`
                }
                })
                document.getElementById("jsonData-formated").innerHTML = JSON.stringify(concatData);
                updateDescriptionForAllTag(concatData);
            });
        };
        fileReader.readAsBinaryString(selectedFile);
    }
});

const graphCoolEndpoint = "";
const updateDescriptionForAllTag = async (concatData) => {
    if (!concatData || concatData.length < 1) {
        return;
    }
    const response = await new Promise((resolve, reject)=> {
        setTimeout(() => { return resolve('done')}, 2000)
    }); //updateDesription(graphCoolEndpoint, {modelID: data.id, matterTagId: data.id, description: description});
    updateDescriptionForAllTag(concatData.slice(1));
}

const updateDesription = async (graphCoolEndpoint, payLoad) => {
    const query = JSON.stringify({
        query: `mutation {
            patchMattertag(
                modelId: "${payLoad.modelId}",
                mattertagId: "${payLoad.modelId}",
                patch: "${payLoad.description}"
            }
        `
    });

    const response = await fetch(graphCoolEndpoint, {
        headers: {'content-type': 'application/json'},
        method: 'POST',
        body: query,
    });
    
    const responseJson = await response.json();
    return responseJson.data;
};

const getModel = async () => {
    const response = await fetch(graphURL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${authToken}`
        },
        body: JSON.stringify({
            query: `{
                models {
                    results {
                        include,
                        query,
                        sortBy,
                        pageSize,
                        offset
                    }
                }
            }`
        })
    });

    console.log('response', response)
}


