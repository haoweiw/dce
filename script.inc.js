/* -*- Javascript -*- */

/* global variables */

var config = new Array ();
var nbelements = 0;
var file = null;
var mac_list = [];


/* object type*/

function Host () {
  return { line: 0, hostname: '', macaddr: '', ipaddr: '' };
}



/* process data */

function process_data (data) {

  /* clean previous list */
  config = new Array ();
  nbelements = 0;
  data = data.replace (/\r\n/g, '\n').replace (/\r/g, '\n');
  file = data;

  /* process line by line */
  var tab = data.split ('\n');
  line = [];
  //console.log(tab[118])
  for (var i in tab) {
    //if (tab[i].indexOf("host chromeos") > -1 || tab[i].indexOf("hardware ethernet") > -1 || tab[i].indexOf("fixed-address") > -1) {
    if (tab[i].indexOf("host chromeos") > -1) {
      var host = tab[i].replace (/;/g, ' ', 'g').replace (/#.*/, '')
      //console.log(host)
      var mac = tab[++i].replace (/;/g, ' ', 'g').replace (/#.*/, '')
      //mac_list.push(mac)
      //console.log(mac)
      var ip = tab[++i].replace (/;/g, ' ', 'g').replace (/#.*/, '') 
      //console.log(ip)
      line = host.concat(mac, ip).replace(/[ ,]+/g, ",")
      //console.log(line)
      //line = tab[i]
    /* avoid comments and keep only host line */
    //var line = tab[i].replace (/#.*/, ''). replace (/;/g, ' ', 'g'). replace(/\t/g, ' ', 'g')
      //console.log(line)
    //if (!line.match(/^\s*host\s/) && !line.match(/^\s*hardware ethernet\s/) && !line.match(/^\s*fixed-address\s/))
    //if (!tab[i].match(/^\s*host\s/) && !tab[i].match(/^\s*hardware ethernet\s/) && !tab[i].match(/^\s*fixed-address\s/))
       //continue;
       //console.log(tab)
       //var array = line.toString() 
  //console.log(line) 

    /* new entry */
      config[nbelements++] = new Host ();
      config[nbelements - 1].line = i - 1;
   
    
    /* analyse each word */
    var word = line.split (',');
    var action = '';
    for (var j in word) {
      //console.log(word[j])
      /* look for keyword */
      switch (word[j]) {
      case '': break;
      case '\thost': case 'host': case '\t\thost': action = 'host'; break;
      case 'ethernet': action = 'macaddr'; break;
      case '\t\tfixed-address': case 'fixed-address': case '\t\t\tfixed-address': action = 'ipaddr'; break;
      default:

        /* retrieve fields */
        switch (action) {
        case 'host': config[nbelements - 1].hostname = word[j]; action = ''; break;
        case 'macaddr': config[nbelements - 1].macaddr =  word[j]; action = ''; break;
        case 'ipaddr': config[nbelements - 1].ipaddr =  word[j]; action = ''; break;
        }

        break;
      }

    }
   }   
 
  }
}

/* add event action */

function add_event (obj, type, fn) {

  if (obj.attachEvent) {
    obj['e' + type + fn] = fn;
    obj[type + fn] = function () { obj['e' + type + fn] (window.event); };
    obj.attachEvent ('on' + type, obj[type + fn]);
  } else
    obj.addEventListener (type, fn, false);
}

/* check input */

function check_input (event) {

  var ref = event.target;
  if ((!ref) || (typeof ref.regexp === 'undefined'))
    return;

  if (ref.value.match (ref.regexp)) {
    if (typeof ref.style.foregroundColor !== 'undefined')
      ref.style.color = ref.style.foregroundColor;
  } else {
    if (typeof ref.style.foregroundColor === 'undefined')
      ref.style.foregroundColor = ref.style.color;
    ref.style.color = 'red';
  }
}

/* import procedure */

function import_proc (data) {

  process_data (data);

  /* remove previous table */
  var table = document.getElementById ('config');
  if (!table) {
    update_status ('can\'t find previous table');
    return;
  }
  var father = table.parentNode;
  father.removeChild (table);

  /* clean previous list */
  table = new Array ();
  nbelements = 0;
  file = data;

  /* create new table */
  table = document.createElement ('table');
  table.className = 'table';
  table.id = 'config';

  /* create header row */
  var row_config_header = table.insertRow (0);

  /* create hostname column */
  var cell_config_hostname_header = document.createElement('th');
  row_config_header.appendChild (cell_config_hostname_header);
  cell_config_hostname_header.className = 'fit';
  cell_config_hostname_header.innerHTML = 'Hostname';

  /* create mac address column */
  var cell_config_macaddress_header = document.createElement('th');
  cell_config_macaddress_header.className = 'expand';
  row_config_header.appendChild (cell_config_macaddress_header);
  cell_config_macaddress_header.innerHTML = 'MAC address';

  /* create ip address column */
  var cell_config_ipaddress_header = document.createElement('th');
  row_config_header.appendChild (cell_config_ipaddress_header);
  cell_config_ipaddress_header.innerHTML = 'IP address';

  /* create table */
  for (var i in config) {

    /* create row */
    var row_db = table.insertRow (table.rows.length);

    /* create hostname column */
    var cell_config_hostname = document.createElement('td');
    row_db.appendChild (cell_config_hostname);
    cell_config_hostname.innerHTML = config[i].hostname;

    /* create mac address column */
    var cell_config_macaddress = document.createElement('td');
    cell_config_macaddress.className = 'expand';
    row_db.appendChild (cell_config_macaddress);
    var input_config_macaddress = document.createElement ('input');
    input_config_macaddress.type = 'text';
    input_config_macaddress.id = 'macaddr_' + i;
    input_config_macaddress.value = config[i].macaddr;
    input_config_macaddress.regexp = /^([0-9A-F]{2}[:]){5}([0-9A-F]{2})$/i;
    add_event (input_config_macaddress, 'input', check_input);
    cell_config_macaddress.appendChild (input_config_macaddress);

    /* create ip address column */
    var cell_config_ipaddress = document.createElement('td');
    row_db.appendChild (cell_config_ipaddress);
    cell_config_ipaddress.innerHTML = config[i].ipaddr;

  }

  /* add new table into html page */
  father.appendChild (table);

  /* table is updated */
  update_status ('import done', 0);
}

/* export raw database */

function export_proc () {
 
  for (var i in config) {
    //console.log(config)
    var ref = document.getElementById ('macaddr_' + i);
    //console.log(ref.value)
    if (ref && ref.value.length !== 0) {
      var re = /^([0-9A-F]{2}[:]){5}([0-9A-F]{2})$/i;
      //console.log(ref.value.length)
      if (ref.value.length !== 0 && re.test(ref.value)) {
        console.log(ref.value)
        config[i].macaddr = ref.value;
        
      } else {
        window.alert("Wrong MAC address regular expression")
        return false; 
      }
    } 
  }
 


  //console.log(file)
  /* process line by line */
  var tab = file.split ('\n');
  var j = 0;
  var data = '';
  
  for (var i in tab) {
    if ((j < config.length) && (config[j].line == i)) {
      //console.log(config[j].macaddr)
      if (config[j].macaddr != "") {
        mac_list.push(config[j].macaddr)
        //tab[i] = '\t\thost ' + config[j].hostname + ' {' + '\n' + '\t\t\thardware ethernet ' + config[j].macaddr + ';' + '\n' + '\t\t\tfixed-address ' + config[j].ipaddr + ';';
        tab[i] = '\t\t\thardware ethernet ' + config[j].macaddr + ';';
        j++;
      } else {
          tab[i] = '#\t\t\thardware ethernet ' + config[j].macaddr + ';';
          j++;
      }
    }
  
//    console.log(mac_list)
    if (data.length != 0)
      data += '\n';
//    console.log(tab[i])
    data += tab[i];
  }
  var new_mac_list = mac_list.filter(function(e){return e});
  var sort_mac = new_mac_list.slice().sort();
  console.log(sort_mac)
  for (var i = 0; i < new_mac_list.length - 1; i++) {
    console.log(sort_mac[i+1])
    console.log(sort_mac[i])
    if (sort_mac[i + 1] == sort_mac[i]) {
      window.alert("Duplicate MAC address found!!" + sort_mac[i])
      return false;
    } else {    
      data = data.replace (/\r\n/g, '\n').replace (/\r/g, '\r');
    }
  } 

  
  return data;
}
