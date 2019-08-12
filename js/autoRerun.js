
var timer=null;

function update_lsm_tree(id, lsm_tree_type, lsm_tree_L, lsm_tree_T, lsm_tree_mbuffer, N, E, obsolete_coefficient){
  if(id == 'lsm_tree_L' || id == 'obsolete_coefficient' || id == 'lsm_tree_Z'){
    var result = getLSMTreeT(lsm_tree_type);
    var T = result[0];
    var maxL = result[1];
      if(T < 2){
        alert("L="+lsm_tree_L+" is larger than the maximum L="+maxL+" in LSM-tree.")
        console.log("L="+lsm_tree_L+" is larger than the maximum L="+maxL+" in LSM-tree.");
        update_lsm_tree('lsm_tree_T', lsm_tree_type, lsm_tree_L, lsm_tree_T, lsm_tree_mbuffer, N, E)

    }

    document.getElementById("lsm_tree_T").value=T;


  }

  // else if(id.startsWith('lsm_tree') || id == 'N' || id == "E" || id == "Key-Size" || id == "P"){
  //   var L;
  //   if(lsm_tree_type == 0){
  //     L = Math.log(N*Math.floor(lsm_tree_T-1)*E/lsm_tree_mbuffer)/Math.log(lsm_tree_T);
  //   }else{
  //     L = Math.log(N*E/lsm_tree_mbuffer)/Math.log(lsm_tree_T);
  //   }
  //
  //   if(Math.abs(L - Math.round(L))<1e-6){
  //     L = Math.round(L);
  //   }else{
  //     L = Math.ceil(L);
  //   }
  //   var tmpN;
  //   if(lsm_tree_type == 0){
  //     tmpN = obsolete_coefficient*((1 - 1/Math.pow(lsm_tree_T, L))/(1 - 1/lsm_tree_T)*N*(Math.floor(lsm_tree_T)-1) + lsm_tree_mbuffer/E - N)+N;
  //   }else{
  //     tmpN = obsolete_coefficient*((1 - 1/Math.pow(lsm_tree_T, L))/(1 - 1/lsm_tree_T)*N + lsm_tree_mbuffer/E - N) + N;
  //   }
  //   L = Math.log(tmpN*E*(lsm_tree_T-1)/lsm_tree_mbuffer+1)/Math.log(lsm_tree_T)-1;
  //   if(Math.abs(L - Math.round(L))<1e-6){
  //     L = Math.round(L);
  //   }else{
  //     L = Math.ceil(L);
  //   }
  //
  //   if(L < 0){
  //     L = 0;
  //   }
  //   document.getElementById("lsm_tree_L").value=L;
  // }

  	draw_lsm_graph("lsm_tree");
}

function pushProviderResults(GCP,GCP_x,AWS,AWS_x,Azure,Azure_x,data1,best_provider,current_y,current_x,hoverInfo){
    console.log(hoverInfo);
    if(best_provider==0){
        GCP_x.push(current_x);
        GCP.push(current_y);
        var GCPPoint={
            x: GCP_x,
            y: GCP,
            marker: { size: 7, symbol: 'circle', color: 'steelblue'},
            name: 'GCP',
            mode: 'lines',
            type: 'scatter',
            text: hoverInfo,
            showlegend: false,
            hovertemplate:
                "<b>%{text}</b><br><br>",
            legendgroup: 'GCP'
        }
        data1.push(GCPPoint);
        GCP_x=new Array();
        GCP=new Array();
    }
    if(best_provider==1){
        AWS_x.push(current_x);
        AWS.push(current_y);
        var AWSPoint={
            x: AWS_x,
            y: AWS,
            marker: { size: 7, symbol: 'circle', color: 'green'},
            name: 'AWS',
            mode: 'lines',
            text: hoverInfo,
            showlegend: false,
            hovertemplate:
                "<b>%{text}</b><br><br>",
            type: 'scatter'
        }
        data1.push(AWSPoint);
        AWS_x=new Array();
        AWS=new Array();
    }
    if(best_provider==2){
        Azure_x.push(current_x);
        Azure.push(current_y);
        var AzurePoint={
            x: Azure_x,
            y: Azure,
            marker: { size: 7, symbol: 'circle', color: 'orange'},
            name: 'Azure',
            mode: 'lines',
            text: hoverInfo,
            showlegend: false,
            hovertemplate:
                "<b>%{text}</b><br><br>",
            type: 'scatter'
        }
        data1.push(AzurePoint);
        Azure_x=new Array();
        Azure=new Array();
    }
}

function drawCharts() {
    var Cost=new Array();
    var GCP=new Array();
    var AWS=new Array();
    var Azure=new Array();

    var Azure_x=new Array();
    var GCP_x=new Array();
    var AWS_x=new Array();


    var x=new Array();
    var y=new Array();

    var hoverInfo=new Array();

    var derivative=new Array();

    var data1=[];

    var cost=parseInt(document.getElementById("cost").value.replace(/\D/g,''), 10);
    console.log(cost);

    var best_provider=2;
    var best_provider_now=2;
    var step_width=5;
    var last_throughput=0;
    for(var i=0;i<cost*2;i+=step_width){
        var best_design;
        //console.log(i);
        x.push(i);
        y.push(countThroughput(i));

        var temp_throughput=last_throughput;
        //GCP.push(countThroughput(i,0));
        //AWS.push(countThroughput(i,1));
        //Azure.push(countThroughput(i,2));

        var gcp_design=countThroughput(i,0);
        var aws_design=countThroughput(i,1);
        var azure_design=countThroughput(i,2);
        var gcp=100000/gcp_design.total_cost;
        var aws=100000/aws_design.total_cost;
        var azure=100000/azure_design.total_cost;
        var maxThroughput;


        if(gcp>aws&&gcp>azure) {
            best_provider_now=0;
            GCP.push(gcp);
            GCP_x.push(i);
            maxThroughput=gcp;
            best_design=gcp_design;
            derivative.push((gcp-last_throughput)/step_width);
            last_throughput=gcp;
        }else if(aws>azure){
            best_provider_now=1;
            AWS.push(aws);
            AWS_x.push(i);
            maxThroughput=aws;
            best_design=aws_design;
            derivative.push((aws-last_throughput)/step_width);
            last_throughput=aws;
        }else{
            best_provider_now=2;
            Azure.push(azure);
            Azure_x.push(i);
            maxThroughput=azure;
            best_design=azure_design;
            derivative.push((azure-last_throughput)/step_width);
            last_throughput=azure;
        }
        hoverInfo.push("T="+best_design.T+" K="+best_design.K+" Z="+best_design.Z+" L="+best_design.L +" Buffer size="+(best_design.Buffer/1024/1024/1024).toFixed(2)+"GB M_BF="+(best_design.M_BF/1024/1024/1024).toFixed(2)+"GB M_FP="+(best_design.M_FP/1024/1024/1024).toFixed(2)+"GB");
        if(best_provider_now!=best_provider){
            pushProviderResults(GCP,GCP_x,AWS,AWS_x,Azure,Azure_x,data1,best_provider,maxThroughput,i,hoverInfo);
            if (best_provider==0) {
                GCP = new Array();
                GCP_x = new Array();
            }else if(best_provider==1){
                AWS = new Array();
                AWS_x=new Array();
            }else {
                Azure_x = new Array();
                Azure = new Array();
            }

            if (i>0) {
                if (best_provider_now == 0) {
                    GCP.push(temp_throughput);
                    GCP_x.push(i - 1);
                } else if (best_provider_now == 1) {
                    AWS.push(temp_throughput);
                    AWS_x.push(i - 1);
                } else {
                    Azure.push(temp_throughput);
                    Azure_x.push(i - 1);
                }
            }


            hoverInfo=new Array();
            hoverInfo.push("T="+best_design.T+" K="+best_design.K+" Z="+best_design.Z+" L="+best_design.L +" Buffer size="+(best_design.Buffer/1024/1024/1024).toFixed(2)+"GB M_BF="+(best_design.M_BF/1024/1024/1024).toFixed(2)+"GB M_FP="+(best_design.M_FP/1024/1024/1024).toFixed(2)+"GB");
        }
        best_provider=best_provider_now;

    }

    pushProviderResults(GCP,GCP_x,AWS,AWS_x,Azure,Azure_x,data1,best_provider,maxThroughput,i,hoverInfo);
    GCP=new Array();
    AWS=new Array();
    Azure=new Array();

    Azure_x=new Array();
    GCP_x=new Array();
    AWS_x=new Array();

    console.log(x);
    var trace = {
        x: x,
        y: derivative,
        type: 'scatter'
    };

    var GCPPoint={
        x: GCP_x,
        y: GCP,
        marker: { size: 7, symbol: 'circle', color: 'steelblue'},
        name: 'GCP',
        //mode: 'markers',
        hovertemplate:
            "<b>%{text}</b><br><br>",
        type: 'scatter'
    }

    var AWSPoint={
        x: AWS_x,
        y: AWS,
        marker: { size: 7, symbol: 'circle', color: 'green'},
        name: 'AWS',
        //mode: 'markers',
        hovertemplate:
            "<b>%{text}</b><br><br>",
        type: 'scatter'
    }

    var AzurePoint={
        x: Azure_x,
        y: Azure,
        marker: { size: 7, symbol: 'circle', color: 'orange'},
        name: 'Azure',
        //mode: 'markers',
        hovertemplate:
            "<b>%{text}</b><br><br>",
        type: 'scatter'
    }

    for(var i=0;i<derivative.length;i++){
        if(derivative[i]>15000);
            //derivative[i]=(derivative[i-1]+derivative[i+1]+derivative[i-2]+derivative[i+2])/4;
    }

    var data=[trace];

    var layout =
        {
            xaxis: {
                title: 'Cost',
                range: [ 0, cost*2+100 ]
            },
            yaxis: {
                title: 'Throughput',
            },
            autosize: true,
            width: 600,
            height: 300,
            //title:'Pareto frontiers for State-of-the-art and Monkey Tuning'
            margin: {
                l: 60,
                r: 20,
                b: 50,
                t: 20,
                pad: 5
            }, title: ''
        };

    var layout1 =
        {
            xaxis: {
                title: 'Cost',
                range: [ 0, cost*2+100 ]
            },
            yaxis: {
                title: 'Throughput',
                type: 'log',
                autorange: true
            },
            autosize: true,
            width: 600,
            height: 300,
            //title:'Pareto frontiers for State-of-the-art and Monkey Tuning'
            margin: {
                l: 60,
                r: 20,
                b: 50,
                t: 20,
                pad: 5
            }, title: ''
        };


    Plotly.newPlot('tester', data, layout1);

    Plotly.newPlot('tester2', data1, layout);

    //Plotly.newPlot('tester3', data, layout);

    var myPlot = document.getElementById('tester2')

    myPlot.on('plotly_hover', function (eventdata){
        var points = eventdata.points[0],
            pointNum = points.x;
        console.log(pointNum);
        Plotly.Fx.hover('tester',[
            { xval :pointNum }
        ]);
    });
}

function drawChart2() {
    var Azure=new Array();
    var GCP=new Array();
    var AWS=new Array();
    var x=new Array();
    var GCP_hover=new Array();
    var AWS_hover=new Array();
    var Azure_hover=new Array();

    var cost=parseInt(document.getElementById("cost").value.replace(/\D/g,''), 10);
    var step_width=1;

    for(var i=0;i<cost*2;i+=step_width){
        var gcp_design=countThroughput(i,0);
        var aws_design=countThroughput(i,1);
        var azure_design=countThroughput(i,2);
        var gcp=100000/gcp_design.total_cost;
        var aws=100000/aws_design.total_cost;
        var azure=100000/azure_design.total_cost;

        x.push(i);
        GCP.push(gcp);
        AWS.push(aws);
        Azure.push(azure);

        GCP_hover.push("T="+gcp_design.T+" K="+gcp_design.K+" Z="+gcp_design.Z+" L="+gcp_design.L +" Buffer size="+(gcp_design.Buffer/1024/1024/1024).toFixed(2)+"GB M_BF="+(gcp_design.M_BF/1024/1024/1024).toFixed(2)+"GB M_FP="+(gcp_design.M_FP/1024/1024/1024).toFixed(2)+"GB");
        AWS_hover.push("T="+aws_design.T+" K="+aws_design.K+" Z="+aws_design.Z+" L="+aws_design.L +" Buffer size="+(aws_design.Buffer/1024/1024/1024).toFixed(2)+"GB M_BF="+(aws_design.M_BF/1024/1024/1024).toFixed(2)+"GB M_FP="+(aws_design.M_FP/1024/1024/1024).toFixed(2)+"GB");
        Azure_hover.push("T="+azure_design.T+" K="+azure_design.K+" Z="+azure_design.Z+" L="+azure_design.L +" Buffer size="+(azure_design.Buffer/1024/1024/1024).toFixed(2)+"GB M_BF="+(azure_design.M_BF/1024/1024/1024).toFixed(2)+"GB M_FP="+(azure_design.M_FP/1024/1024/1024).toFixed(2)+"GB");


    }

    var GCPPoint={
        x: x,
        y: GCP,
        marker: { size: 7, symbol: 'circle', color: 'steelblue'},
        name: 'GCP',
        //mode: 'markers',
        text: GCP_hover,
        hovertemplate:
            "<b>%{text}</b><br><br>",
        type: 'scatter'
    }

    var AWSPoint={
        x: x,
        y: AWS,
        marker: { size: 7, symbol: 'circle', color: 'green'},
        name: 'AWS',
        //mode: 'markers',
        text: AWS_hover,
        hovertemplate:
            "<b>%{text}</b><br><br>",
        type: 'scatter'
    }

    var AzurePoint={
        x: x,
        y: Azure,
        marker: { size: 7, symbol: 'circle', color: 'orange'},
        name: 'Azure',
        //mode: 'markers',
        text: Azure_hover,
        hovertemplate:
            "<b>%{text}</b><br><br>",
        type: 'scatter'
    }

    var data=[GCPPoint,AWSPoint,AzurePoint];


    var layout1 =
        {
            xaxis: {
                title: 'Cost',
                range: [ 0, cost*2+100 ]
            },
            yaxis: {
                title: 'Throughput',
                type: 'log',
                autorange: true
            },
            autosize: true,
            width: 600,
            height: 300,
            //title:'Pareto frontiers for State-of-the-art and Monkey Tuning'
            margin: {
                l: 60,
                r: 20,
                b: 50,
                t: 20,
                pad: 5
            }, title: ''
        };

    Plotly.newPlot('tester2', data, layout1);
}


function re_run(e, input_type) {





    if(timer){
        clearTimeout(timer);
        timer = null;
    }

    var event = e || event;
    // console.log(event)

    var x = event.which || event.keyCode;  // Use either which or keyCode, depending on browser support
    // console.log(event.timeStamp)
    // console.log(x)

    if (!((x==38 || x==40) && (event.target.id=="E" || event.target.id=="mbuffer" || event.target.id=="P" || event.target.id=="T")))
    {
	    if (x>=37 && x<=40 || x==9 || x==16 || x==17 || x==91 || x==18 || x==65)
	    {
	        // if (event.target.id=="N" || event.target.id=="mfilter")
	        console.log("User is clicking ["+x+"] on arrows or tab (9) or shift (16) or ctrl (17) or cmd (91) or alt (18). No rerun.")
	        return;
	    }
	}




    navigateDesignSpace();
    //drawCharts();
    drawChart2();
    /*
    if(event.target.id.endsWith("mfilter_per_entry"))
    {
        var mfilter_per_entry = parseFloat(document.getElementById(event.target.id).value);
        if(!isNaN(mfilter_per_entry)){
        document.getElementById(event.target.id).value=mfilter_per_entry
      }else{
        document.getElementById(event.target.id).value="";
      }
        // console.log(numberWithCommas(N))
    }

    var N = parseInt(document.getElementById("N").value.replace(/\D/g,''),10);
    var P = parseInt(document.getElementById("P").value.replace(/\D/g,''),10);
    document.getElementById("N").value=numberWithCommas(N)
    var E = parseInt(document.getElementById("E").value.replace(/\D/g,''),10);

    var w=parseFloat(document.getElementById("w").value);
    var r=parseFloat(document.getElementById("r").value);
    var v=parseFloat(document.getElementById("v").value);
    var qL=parseFloat(document.getElementById("qL").value);

    var obsolete_coefficient_str = document.getElementById("obsolete_coefficient").value;
    if(isNaN(obsolete_coefficient_str)){
      alert(obsolete_coefficient_str+" is not valid.")
      console.log("UI ratio is not valid: "+obsolete_coefficient_str)
      document.getElementById("UI-ratio").value=1.0;
    }
    var obsolete_coefficient = parseFloat(obsolete_coefficient_str);
    if(obsolete_coefficient > 1 || obsolete_coefficient < 0){
      alert(obsolete_coefficient+" should be in the range of [0, 1].")
      console.log("Obsolete coefficient should be in the range of (0, 1) :"+key_size)
      document.getElementById("obsolete_coefficient").value=1.0;
    }

    if(r <= 0.0){
      document.getElementById("Zero-result-lookup-text-Div").style.display='none';
    }else{
      document.getElementById("Zero-result-lookup-text-Div").style.display='';
    }

    var key_size;
    if(event.target.id == "Key-Size"){
      key_size = document.getElementById("Key-Size").value;
      if(isNaN(key_size)){
        alert("Key_Size="+key_size+" is not a valid number.")
        console.log("Key Size is not a valid number: "+key_size)
        document.getElementById("Key-Size").value=E/2;
      }else if(key_size <= 0 || key_size >= E){
        alert("Key_Size="+key_size+" should be in the range of (0, " + E + ").")
        console.log("Key Size should be in the range of (0, " + E + ") :"+key_size)
        document.getElementById("Key-Size").value=E/2;
      }else{
        document.getElementById("lsm_bush_mfence_pointer_per_entry").value=key_size/(P/E)*8;
        document.getElementById("lsm_tree_mfence_pointer_per_entry").value=key_size/(P/E)*8;
      }
    }

    if(input_type == "dataset_input"){
      document.getElementById("data-text").setAttribute("data-tooltip",
      "The dataset consists of " + formatBytes(N*E, 1) +
      " of data comprising unique " + E +
      "-byte key-value pairs of " + key_size +
      "-byte keys");
    }else if(input_type == "workload_input"){
      var sum = qL+r+v+w;
      document.getElementById("workload-text").setAttribute("data-tooltip",
      "The workload consists of " + (w/sum*100).toFixed(3) +
      "% writes, " + ((v+r)/sum*100).toFixed(3) +
      "% point lookups, and " + (qL/sum*100).toFixed(3) +
      "% range lookups with target range of " + s +
      " entries");
    }else if(input_type == "storage_input"){
      document.getElementById("storage-text").setAttribute("data-tooltip",
      "The storage device is an SSD with " + formatBytes(P, 1) +
      " blocks and for which reading a block takes " + document.getElementById("read-latency").value +
      " microseconds and writing a block takes " + document.getElementById("write-latency").value +
      " microseconds");
    }

    //lsh-Table
    var lsh_table_mbuffer = document.getElementById("lsh_table_mbuffer").value;
    if(isNaN(lsh_table_mbuffer)){
      alert("LSH-Table buffer="+lsh_table_mbuffer+" MB is invalid.")
      console.log("LSH-Table buffer is invalid: "+lsh_table_mbuffer);
      document.getElementById("lsh_table_mbuffer") = 2;
      lsh_table_mbuffer = 2;
    }
    lsh_table_mbuffer = parseFloat(lsh_table_mbuffer);
    if (lsh_table_mbuffer<0){
        alert("Buffer="+lsh_table_mbuffer+" is too small in LSH-Table.");
        document.getElementById("lsh_table_mbuffer") = 2;
        lsh_table_mbuffer = 2;
    }
    lsh_table_mbuffer *= 1048576;
    var hash_table_gc_threshold =document.getElementById("lsh_table_gc_threshold").value;
    if(isNaN(hash_table_gc_threshold)){
      alert("GC Threshold="+hash_table_gc_threshol+" is invalid.");
      console.log("The threshold ratio of garbage collection is invalid: "+hash_table_gc_threshold);
      document.getElementById("lsh_table_gc_threshold").value = 0.5;
      hash_table_gc_threshold = 0.5;
    }
    hash_table_gc_threshold = parseFloat(hash_table_gc_threshold);
    if (hash_table_gc_threshold<=0 || hash_table_gc_threshold >= 1){
        alert("GC Threshold="+hash_table_gc_threshold+" should be in the range (0, 1).");
        document.getElementById("lsh_table_gc_threshold").value = 0.5;
        hash_table_gc_threshold = 0.5;
    }
    var hash_table_key_signature_size = document.getElementById("lsh_table_key_signature_size").value;
    if(isNaN(hash_table_key_signature_size) || Number.isInteger(hash_table_key_signature_size)){
      alert("The size of key signature="+hash_table_key_signature_size+" is invalid.");
      console.log("Thesize of key signature is invalid: "+hash_table_key_signature_size);
      document.getElementById("lsh_table_key_signature_size").value = 10;
      hash_table_key_signature_size = 10;
    }
    hash_table_key_signature_size = parseInt(hash_table_key_signature_size);
    if(hash_table_key_signature_size < 0){
      alert("The size of key signature="+hash_table_key_signature_size+" should be no less than 0.");
      document.getElementById("lsh_table_key_signature_size").value = 10;
      hash_table_key_signature_size = 10;
    }
    var hash_table_hash_bucket_fraction = document.getElementById("lsh_table_hash_bucket_fraction").value;
    if(isNaN(hash_table_hash_bucket_fraction)){
      alert("The bucket fraction="+hash_table_hash_bucket_fraction+" is invalid.");
      console.log("The bucket fraction is invalid: "+hash_table_hash_bucket_fraction);
      document.getElementById("lsh_table_hash_bucket_fraction").value = 1;
      hash_table_hash_bucket_fraction = 10;
    }
    hash_table_hash_bucket_fraction = parseFloat(hash_table_hash_bucket_fraction);
    if(hash_table_hash_bucket_fraction <= 0 || hash_table_hash_bucket_fraction > 1){
      alert("The bucket fraction="+hash_table_hash_bucket_fraction+" should be in the range (0, 1].");
      document.getElementById("lsh_table_hash_bucket_fraction").value = 1;
      hash_table_hash_bucket_fraction = 1;
    }
    scenario1();

    // lsm tree
    var L = document.getElementById("lsm_tree_L").value;
    if(isNaN(L)){
      alert("LSM-Tree Level="+L+" is invalid.")
      console.log("LSM-Tree level is invalid: "+L);
      var tmpN;
      if(lsm_tree_type == 0){
        tmpN = obsolete_coefficient*((1 - 1/lsm_tree_T)/(1 - 1/(Math.pow(lsm_tree_T, L)))*N*(Math.floor(lsm_tree_T)-1) - N)+N;
      }else{
        tmpN = obsolete_coefficient*((1 - 1/lsm_tree_T)/(1 - 1/(Math.pow(lsm_tree_T, L)))*N - N) + N;
      }
      L = Math.ceil(Math.log(tmpN*E*(lsm_tree_T-1)/lsm_tree_mbuffer+1/lsm_tree_T)/Math.log(lsm_tree_T))
      document.getElementById("lsm_tree_L").value = L;
      lsm_tree_L = L;
    }
    lsm_tree_L = parseInt(L);
    if(lsm_tree_L < 1){
      alert("Level="+lsm_tree_L+" is too small in LSM-Tree.");
      document.getElementById("lsm_tree_L").value = 6;
      lsm_tree_L = 6;
    }
    var lsm_tree_mbuffer = document.getElementById("lsm_tree_mbuffer").value;
    if(isNaN(lsm_tree_mbuffer)){
      alert("LSM-Tree buffer="+lsm_tree_mbuffer+" MB is invalid.")
      console.log("LSM-Tree buffer is invalid: "+lsm_tree_mbuffer);
      document.getElementById("lsm_tree_mbuffer").value = 2;
      lsm_tree_mbuffer = 2;
    }
    lsm_tree_mbuffer = parseFloat(lsm_tree_mbuffer);
    if (lsm_tree_mbuffer<0){

        alert("Buffer="+lsm_tree_mbuffer+" is too small in LSM-Tree.");
        document.getElementById("lsm_tree_mbuffer").value = 2;
        lsm_tree_mbuffer = 2;
    }
    lsm_tree_mbuffer *= 1048576;
    var lsm_tree_T = document.getElementById("lsm_tree_T").value;
    if(isNaN(lsm_tree_T)){
      alert("LSM-Tree T="+lsm_tree_T+" is invalid.")
      console.log("LSM-Tree size ratio is invalid: "+lsm_tree_T);
      lsm_tree_T = getLSMTreeT(lsm_tree_type);
      document.getElementById("lsm_tree_T").value = lsm_tree_T;
    }
    lsm_tree_T = parseFloat(lsm_tree_T);
    if (lsm_tree_T<2){

        alert("Size Ratio="+lsm_tree_T+" is too small in LSM-Tree.");
        document.getElementById("lsm_tree_T").value = 2;
        lsm_tree_T = 2;
    }
    // else if(lsm_tree_T > P/E){
    //   alert("Size Ratio="+lsm_tree_T+" is too large in LSM-Tree.");
    //   document.getElementById("lsm_tree_T").value = P/E;
    //   lsm_tree_T = P/E;
    // }
    var lsm_tree_type=getBoldButtonByName("lsm_tree_type");
    update_lsm_tree(event.target.id, lsm_tree_type, lsm_tree_L, lsm_tree_T, lsm_tree_mbuffer, N, E, obsolete_coefficient);

    //B_epsilon tree
    var level = document.getElementById("B_epsilon_tree_level").value;
    var max_b_epsilon_tree_level = Math.ceil(Math.log((N+1)/2)/Math.log(2) - 1);
    if(isNaN(level)){
      alert("Level ="+level+" is invalid.")
      console.log("Level is invalid: "+level);
      level = Math.round((max_b_epsilon_tree_level+1)/3);
    }

    if (level<1){
        alert("Level="+level+" is too small in B Tree.");
        level = Math.round((max_b_epsilon_tree_level+1)/3);
    }else if(level > max_b_epsilon_tree_level){
        alert("Level="+level+" is larger than the maximum level (" + max_b_epsilon_tree_level + ") in B Tree because the fanout should at least be 2.");
        level = Math.round((max_b_epsilon_tree_level+1)/3);
    }
    document.getElementById("B_epsilon_tree_level").value = level;

    scenario3();



    // design continuum
    var design_continuum_T = parseFloat(document.getElementById("design_continuum_T").value);
    var design_continuum_mbuffer = document.getElementById("design_continuum_mbuffer").value;
    if(isNaN(design_continuum_mbuffer)){
      alert("Design Continuum's buffer="+design_continuum_mbuffer+" MB is invalid.")
      console.log("Design Continuum's buffer is invalid: "+design_continuum_mbuffer);
      document.getElementById("design_continuum_mbuffer").value = 2;
      design_continuum_mbuffer = 2;
    }
    design_continuum_mbuffer = parseFloat(design_continuum_mbuffer);
    if (design_continuum_mbuffer<0){
        alert("Buffer="+design_continuum_mbuffer+" is too small in design continuum.");
        document.getElementById("design_continuum_mbuffer").value = 2;
        design_continuum_mbuffer = 2;
    }
    design_continuum_mbuffer *= 1048576;

    var max_partitions = Math.floor(design_continuum_T) - 1;
    var design_continuum_K=document.getElementById("design_continuum_K").value;
    if(isNaN(design_continuum_K)){
      alert("Design Continuum's K="+design_continuum_K+" is invalid.")
      console.log("Design Continuum's K is invalid: "+design_continuum_K);
      document.getElementById("design_continuum_K").value = 2;
      design_continuum_K = 2;
    }else if(design_continuum_K < 1 || design_continuum_K > max_partitions){
      alert("Design Continuum's K="+design_continuum_K+" should locate in ["+ 1+ "," + max_partitions+"].")
      console.log("Design Continuum's K is invalid: "+design_continuum_K);
      document.getElementById("design_continuum_K").value = 2;
      design_continuum_K = 2;
    }

    var design_continuum_Z=document.getElementById("design_continuum_Z").value;
    if(isNaN(design_continuum_Z)){
      alert("Design Continuum's Z="+design_continuum_Z+" is invalid.")
      console.log("Design Continuum's Z is invalid: "+design_continuum_Z);
      document.getElementById("design_continuum_Z").value = 1;
      design_continuum_Z = 1;
    }else if(design_continuum_Z < 1 || design_continuum_Z > max_partitions){
      alert("Design Continuum's Z="+design_continuum_Z+" should locate in ["+ 1+ "," + max_partitions+"].")
      console.log("Design Continuum's Z is invalid: "+design_continuum_Z);
      document.getElementById("design_continuum_Z").value = 1;
      design_continuum_Z = 1;
    }

    var design_continuum_L = document.getElementById("design_continuum_L").value;
    if(isNaN(design_continuum_L)){
      alert("Design Continuum's Level="+design_continuum_L+" is invalid.")
      console.log("Design Continuum's Level is invalid: "+design_continuum_L);
      document.getElementById("design_continuum_L").value = 6;
      design_continuum_L = 7;
    }


    var design_continuum_T = document.getElementById("design_continuum_T").value;
    if(isNaN(design_continuum_T)){
      alert("Design Continuum's T="+design_continuum_T+" is invalid.")
      console.log("Design Continuum's grow factor is invalid: "+design_continuum_T);
      design_continuum_T = getLSMTreeT(3, "design_continuum")[0];
      document.getElementById("design_continuum_T").value = design_continuum_T;
    }
    design_continuum_T = parseFloat(design_continuum_T);
    if (design_continuum_T<2){

        alert("Grow factor="+design_continuum_T+" is too small in design continuum.");
        document.getElementById("design_continuum_T").value = 2;
        design_continuum_T = 2;
    }

    var max_max_node_size = N/(P/E);
    var design_continuum_D = document.getElementById("design_continuum_D").value;
    if(isNaN(design_continuum_D)){
      alert("Design Continuum's D="+design_continuum_D+" is invalid.")
      console.log("Design Continuum's Max Node Size is invalid: "+design_continuum_D);
      design_continuum_D = 1;
      document.getElementById("design_continuum_D").value = design_continuum_D;
    }
    if (design_continuum_D<1 || design_continuum_D > max_max_node_size){

        alert("Max Node Size D="+design_continuum_D+" should locate in ["+ 1+ "," + max_max_node_size+"].")
        document.getElementById("design_continuum_D").value = 1;
        design_continuum_D = 1;
    }

    if(event.target.id == "design_continuum_L" || event.target.id == "design_continuum_Z" || event.target.id == "N"){
      var design_continuum_T = getLSMTreeT(3, "design_continuum")[0];
      if(design_continuum_T <= 2){
        document.getElementById("design_continuum_T").value = 2;
        design_continuum_T = 2;
      }else{
        document.getElementById("design_continuum_T").value = design_continuum_T;
      }
      max_partitions = Math.floor(design_continuum_T) - 1;
      if(design_continuum_K > max_partitions){
        alert("Hot Merge Threshold changes into " + max_partitions + " automatically.");
        document.getElementById("design_continuum_K").value = max_partitions;
      }

      if(design_continuum_Z > max_partitions){
        alert("Cold Merge Threshold changes into " + max_partitions + " automatically.");
        document.getElementById("design_continuum_Z").value = max_partitions;
      }

    }
    draw_lsm_graph("design_continuum");

    re_run_now();
    */
}


function re_run_now() {

    var inputParameters = parseInputTextBoxes();

    var N=inputParameters.N;
    var E=inputParameters.E;
    var P=inputParameters.P;

    var read_latency=inputParameters.read_latency;
    var write_latency=inputParameters.write_latency;
    var s=inputParameters.s;
    var w=inputParameters.w;
    var r=inputParameters.r;
    var v=inputParameters.v;
    var qL=inputParameters.qL;

    if (!isNaN(N))
        document.getElementById("N").value=numberWithCommas(N);
    if (!isNaN(E))
        document.getElementById("E").value=E;
    if (!isNaN(P))
        document.getElementById("P").value=P;
    if (!isNaN(read_latency))
        document.getElementById("read-latency").value=read_latency;
    if (!isNaN(write_latency))
        document.getElementById("write-latency").value=write_latency;
    if (!isNaN(s)){
      document.getElementById("s").value=s;
    }else{
      document.getElementById("s").value=8192;
    }

    if (!isNaN(w)){
      document.getElementById("w").value=w;
    }else{
      document.getElementById("w").value=1;
      w = 1;
    }

    if (!isNaN(r)){
      document.getElementById("r").value=r;
    }else{
      document.getElementById("r").value=1;
      r = 1;
    }

    if (!isNaN(v)){
      document.getElementById("v").value=v;
    }else{
      document.getElementById("v").value=1;
      v = 1;
    }

    if (!isNaN(qL)){
      document.getElementById("qL").value=qL;
    }else{
      document.getElementById("qL").value=1;
      qL = 1;
    }



    if(N >= Number.MAX_SAFE_INTEGER){
      alert("Too large N can't be supported!");
      document.getElementById("N").value=68719476736;
      return;
    }


    //clickbloomTuningButton(false)

}
