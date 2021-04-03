var data_all = {};
$(function () {
    var results_mean_centers_2_pca, results_mean_centers_2_raw, results_mean_kmeans_2;
    // var path1 = "results_mean_centers_2_pca.csv";
    var path2 = "results_mean_centers_2_raw.csv";
    // var path3 = "results_mean_kmeans_2.csv";
    // var path4 = "results_mean_centers_3_pca.csv";
    var path5 = "results_mean_centers_3_raw.csv";
    // var path6 = "results_mean_kmeans_3.csv";
    // var path7 = "results_all_centers_2_pca.csv";
    var path8 = "results_all_centers_2_raw.csv";
    // var path9 = "results_all_kmeans_2.csv";
    // var path10 = "results_all_centers_3_pca.csv";
    var path11 = "results_all_centers_3_raw.csv";
    // var path12 = "results_all_kmeans_3.csv";
    var d = $.Deferred ();
    $.when (
        // $.ajax ({url: path1}). done (function (data) {results_mean_centers_2_pca = d3.csvParseRows(data); d.resolve ();}),
        $.ajax ({url: path2}). done (function (data) {results_mean_centers_2_raw = d3.csvParseRows(data); d.resolve ();}),
        // $.ajax ({url: path3}). done (function (data) {results_mean_kmeans_2 = d3.csvParseRows(data); d.resolve ();}),
        // $.ajax ({url: path4}). done (function (data) {results_mean_centers_3_pca = d3.csvParseRows(data); d.resolve ();}),
        $.ajax ({url: path5}). done (function (data) {results_mean_centers_3_raw = d3.csvParseRows(data); d.resolve ();}),
        // $.ajax ({url: path6}). done (function (data) {results_mean_kmeans_3 = d3.csvParseRows(data); d.resolve ();}),
        // $.ajax ({url: path7}). done (function (data) {results_all_centers_2_pca = d3.csvParseRows(data); d.resolve ();}),
        $.ajax ({url: path8}). done (function (data) {results_all_centers_2_raw = d3.csvParseRows(data); d.resolve ();}),
        // $.ajax ({url: path9}). done (function (data) {results_all_kmeans_2 = d3.csvParseRows(data); d.resolve ();}),
        // $.ajax ({url: path10}). done (function (data) {results_all_centers_3_pca = d3.csvParseRows(data); d.resolve ();}),
        $.ajax ({url: path11}). done (function (data) {results_all_centers_3_raw = d3.csvParseRows(data); d.resolve ();}),
        // $.ajax ({url: path12}). done (function (data) {results_all_kmeans_3 = d3.csvParseRows(data); d.resolve ();}),
    ) .done (function () {
        // data_all.results_mean_centers_2_pca = results_mean_centers_2_pca;
        data_all.results_mean_centers_2_raw = results_mean_centers_2_raw;
        // data_all.results_mean_kmeans_2 = results_mean_kmeans_2;
        // data_all.results_mean_centers_3_pca = results_mean_centers_3_pca;
        data_all.results_mean_centers_3_raw = results_mean_centers_3_raw;
        // data_all.results_mean_kmeans_3 = results_mean_kmeans_3;
        // data_all.results_all_centers_2_pca = results_all_centers_2_pca;
        data_all.results_all_centers_2_raw = results_all_centers_2_raw;
        // data_all.results_all_kmeans_2 = results_all_kmeans_2;
        // data_all.results_all_centers_3_pca = results_all_centers_3_pca;
        data_all.results_all_centers_3_raw = [results_all_centers_3_raw[2],results_all_centers_3_raw[0],results_all_centers_3_raw[1]];
        // data_all.results_all_kmeans_3 = results_all_kmeans_3;
    });
});


function submit() {
    let cat=['Radius','Texture','Perimeter','Area','Smoothness','Compactness','Concavity','ConcavePoints','Symmetry','FractalDimension'];
    let valid = true, optional = true;
    let param = {};
    cat.forEach(e => {
        let key1 = e+"_mean";
        let key2 = e+"_sd";
        param[key1] = document.getElementById(key1).value;
        param[key2] = document.getElementById(key2).value;
        if (!param[key1] || !parseFloat(param[key1])) {
            valid = false;
        }
        if (!param[key2] || !parseFloat(param[key2])) optional = false;
    });
    if(!valid){
        alert('Please finish the input');
        return;
    }
    let param_arr = [];
    cat.forEach(e => {
        let key = e+"_mean";
        param_arr.push(parseFloat(param[key]));
    })
    if(optional){
        cat.forEach(e => {
            let key = e+"_sd";
            param_arr.push(parseFloat(param[key]));
        })
    }
    // let data = {
    //     // 'center_pca': data_all[`results_${optional?'all':'mean'}_centers_${document.getElementById('cluster').value}_pca`],
    //     'center_raw': data_all[`results_${optional?'all':'mean'}_centers_${document.getElementById('cluster').value}_raw`],
    //     // 'kmeans': data_all[`results_${optional?'all':'mean'}_kmeans_${document.getElementById('cluster').value}`]
    // }
    mean = [];
    let dis = []
    let data = data_all[`results_${optional?'all':'mean'}_centers_${document.getElementById('cluster').value}_raw`];
    for(let j =0;j<data[0].length;j++){
        mean[j]=0;
        for(let i =0;i<data.length;i++){
            mean[j]+=parseFloat(data[i][j]);
        }
        mean[j] /= data.length;
        param_arr[j] /= mean[j];
    }
    for(let i =0;i<data.length;i++){
        for(let j =0;j<data[i].length;j++){
            data[i][j]=parseFloat(data[i][j])/mean[i];
        }
        dis[i] = computeDis(param_arr, data[i]);
    }
    let theResult = ''
    let ind = indexOfSmallest(dis);
    if(Math.min(...dis) > 2000)
        theResult = 'abnormal.<br/> Please check your input or contact doctors'
    else{
        if(!optional){
            if(ind == 0) theResult = 'benign'; 
            else theResult = 'malignant';
        }
        if(optional){
            if(ind == 0) theResult = 'benign'; 
            else theResult = 'malignant';
        }
    }
    document.getElementById("result").innerHTML = `Based on the Machine Learning result, your result is ${theResult}.`;
}

function computeDis(a, b){
    if(a.length === 0 || b.length === 0) return -1;
    if(a.length != b.length) return -1;
    let sum =0;
    for(let i=0;i<a.length;i++){
        sum += (a[i]-b[i])*(a[i]-b[i]);
    }
    sum /= a.length;
    return sum;
}

function indexOfSmallest(a) {
    return a.indexOf(Math.min.apply(Math, a));
}