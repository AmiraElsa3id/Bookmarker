var inputList = Array.from(document.querySelectorAll(".input-item"));
var siteName = document.getElementById("siteName");
var siteURL = document.getElementById("siteURL");
var tableOutput = document.getElementById("table-output");
var boxInfo = document.querySelector(".box-info");
var closeBtn = document.getElementById("closeBtn");
var submitBtn = document.getElementById("submitBtn");
var deleteBtnList = Array.from(document.querySelectorAll(".btn-delete"));
var searchInput =document.getElementById("searchInput");
var sitesList;
var currentIndex;
var validatedInput;
var regex = {
    siteName: /^[a-zA-Z0-9 ]{1,10}$/,
    siteURL: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i
};

if (localStorage.getItem('siteData') !== null) {
    sitesList = JSON.parse(localStorage.getItem('siteData'));
    display(sitesList);
} else {
    sitesList = [];
}

for (var i = 0; i < inputList.length; i++) {
    inputList[i].addEventListener("input", function (e) {
        validateInput(e.target);
    });
}

submitBtn.addEventListener("click", function () {
    var siteData = {
        siteName: siteName.value,
        siteURL: siteURL.value
    };
    console.log(siteData);
    validatedInput = validate(siteData);
    if (validatedInput) {
        if(submitBtn.innerHTML==="Submit"){
            sitesList.push(siteData);
        }else if(submitBtn.innerHTML==="Update"){
            sitesList.splice(currentIndex,1,siteData);
            submitBtn.innerHTML="Submit"
        }
        localStorage.setItem("siteData", JSON.stringify(sitesList));
        display(sitesList);
        resetForm();
        boxInfo.classList.add("d-none");
    } else {
        console.log("Wrong");
        boxInfo.classList.remove("d-none");
    }
});

function closeBox() {
    boxInfo.classList.add("d-none");
}

function validate(data) {
    return regex.siteName.test(data.siteName) && regex.siteURL.test(data.siteURL);
}

function validateInput(input) {
    if (regex[input.id].test(input.value)) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
    } else {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
    }
}

function deleteBookmark(index) {
    sitesList.splice(index, 1);
    display(sitesList);
    localStorage.setItem("siteData", JSON.stringify(sitesList));
}
function editBookmark(index){
    currentIndex=index;
    submitBtn.innerHTML="Update"
    var bookmarkData = sitesList[index];
    siteName.value = bookmarkData.siteName;
    siteURL.value=bookmarkData.siteURL
}
searchInput.addEventListener("input",function(){
    var searchValue = searchInput.value;
    var searchOutput=[];
    for(var i=0;i<sitesList.length;i++){
        if(sitesList[i].siteName.toLowerCase().includes(searchValue.toLowerCase())){
            searchOutput.push(sitesList[i]);
        }
        display(searchOutput);
    }
})
function display(list) {
    var box = ``;
    if (list.length === 0) {
        tableOutput.innerHTML = box;
    } else {
        for (var i = 0; i < list.length; i++) {
            box += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${list[i].siteName}</td>
                    <td>
                        <div onclick="visitSite('${list[i].siteURL}')" class="btn btn-visit text-capitalize"><i class="fa fa-eye"></i> Visit</div>
                    </td>
                    <td>
                        <div onclick="deleteBookmark(${i})" class="btn btn-delete text-capitalize"><i class="fa fa-trash"></i> Delete</div>
                    </td>
                    <td>
                        <div onclick="editBookmark(${i})" class="btn btn-edit text-capitalize"><i class="fa fa-edit"></i> Edit</div>
                    </td>
                </tr>
            `;
        }
        tableOutput.innerHTML = box;
    }
}


function resetForm() {
    siteName.value = '';
    siteURL.value = '';
    siteName.classList.remove("is-valid", "is-invalid");
    siteURL.classList.remove("is-valid", "is-invalid");
}

function visitSite(url) {
    window.open(url, '_blank');
}
