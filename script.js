/* -*- Javascript -*- */

var last_action = '';

/* create XML HTML Request object */

function create_xhr_object () {

  if (window.XMLHttpRequest)
    return new XMLHttpRequest ();

  if (window.ActiveXObject) {
    var names = ['Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.3.0',
                 'Msxml2.XMLHTTP', 'Microsoft.XMLHTTP'];
    for (var i in names) {
      try{
        return new ActiveXObject (names[i]);
      }
      catch (err) {
      }
    }
  }

  window.alert ('Your browser does not handle XMLHTTPRequest object.');

  return null;
}

function ajax_post (params, rxfunc, func) {
  if ((typeof func === 'undefined') || (func == '')) func = 'func.php';

  var xhr = create_xhr_object ();

  xhr.onreadystatechange = function() {

    /* cursor */
    if (xhr.readyState == 4)
       document.getElementsByTagName ('body')[0].style.cursor = 'default';

    if ((xhr.readyState == 4) && (xhr.status == 200) && (xhr.responseXML != null)) {

      try {
        rxfunc (xhr.responseXML.documentElement.getElementsByTagName ('message')[0]);
      }
      catch (err) {
        update_status ('can\'t understand server answer \'' + err + '\'', -1);
      }

    } else if (xhr.readyState == 4)
      update_status ('network error', -1);
  }

  /* cursor */
  document.getElementsByTagName ('body')[0].style.cursor = 'wait';

  xhr.open ('POST', func, true);

  xhr.setRequestHeader ('Content-type', 'application/x-www-form-urlencoded');
  //xhr.setRequestHeader ('Content-length', params.length);
  //xhr.setRequestHeader ('Connection', 'close');

  xhr.send (params);

  return;
}

/* function to activate submit on return for multiple input form */

function submit_on_return (event, func) {
  if ((event != null) && (event.keyCode == 13))
    return func ();
  return false;
}

/* base64 encode function */

var base64_encode = function (a,b,c,d,e,f) {
    b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    c="=";
    for(d=f="";e&=3,a.charAt(d++)||(b="=",e);f+=b.charAt(63&c>>++e*2))c=c<<8|a.charCodeAt(d-=!e);
    return f;
};

/* base64 decode function */

var base64_decode = function (d,b,c,u,r,q,x) {
    b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for(r=q=x="";c=d.charAt(x++);~c&&(u=q%4?u*64+c:c,q++%4)?r+=String.fromCharCode(255&u>>(-2*q&6)):0) c=b.indexOf(c);
    return r;
};

/* hash function */

function hash (key) {
  var N = 8;
  var tab = new Array;
  for (var i = 0; i < N; i++)
    tab[i] = 0;
  var len = (tab.length > 2 * N) ? tab.length : 2 * N;
  for (var i = 0, j = 0, k = 0; i < len; i++, j = (j + 1) % key.length, k = (k + 1) % N)
    tab[k] += Math.floor (key.charCodeAt (j) * 17 / 13) + tab[(k > 0) ? k - 1 : N - 1];
  var h = "";
  for (var i = 0; i < N; i++)
    h += String.fromCharCode (tab[i] & 255);
  return base64_encode (h);
}

/* status function */

function update_status (message, stat, incr) {

  if (message == null) message = '';
  message = message.replace (/\n*$/, '');

  var classname = 'empty';
  if (message.length > 0) {
    if (stat == -1) classname = 'server';
    else if (stat == 0) classname = 'message';
    else if (stat == 1) classname = 'warning';
    else classname = 'error';
  }

  var status = document.getElementById ('status');

  status.className = classname;

  if (!incr)
    status.innerHTML = '';
  status.innerHTML += '<p>' + message.replace (/\n/g, '</p>\n<p>') + '</p>';

}


/* log function */

function log (type) {

  var ref;
  var msg = '';
  var logname = '';
  var pwd = '******';

  var list_login = new Array ('import', 'export', 'logout');
  var list_logout = new Array ('pwd', 'login');
  var admin_hash = "O8rWb6NQhTc=";

  switch (type) {
  case 'in':
    ref = document.getElementById ('pwd');
    if (ref)
      pwd = ref.value;
    if (admin_hash == hash (pwd)) {

      var tab = list_login;
      for (var i in tab) {
        ref = document.getElementById (tab[i]);
        if (ref)
          ref.style.display = 'block';
      }
      tab = list_logout;
      for (var i in tab) {
        ref = document.getElementById (tab[i]);
        if (ref)
          ref.style.display = 'none';
      }

      update_status ('login', 0);
    } else
      update_status ('incorrect password', 1);

    break;

  case 'out':

    var tab = list_logout;
    for (var i in tab) {
      ref = document.getElementById (tab[i]);
      if (ref)
        ref.style.display = 'block';
    }
    tab = list_login;
    for (var i in tab) {
      ref = document.getElementById (tab[i]);
      if (ref)
        ref.style.display = 'none';
    }

    /* go back to list tab */
    var page = document.getElementById ('page_help');
    page.style.display = 'block';

    update_status ('logout', 0);
    break;

  default:
    update_status ('log in/out error', 1);
  }
}

/* menu action */

function show_tab (func, arg1) {

  var list_of_pages = new Array('help', 'edit', 'export', 'import');

  for (var i in list_of_pages) {

    var page_i = document.getElementById ('page_' + list_of_pages[i]);
    page_i.style.display = 'none';

  }

  var page = document.getElementById ('page_' + func);
  page.style.display = 'block';

  //var message = menu_callbacks['cb_' + func](arg1);
  var message = '';

  update_status (message, (message.length > 0) ? 1 : 0);
}

/* import input */

function import_input () {

  update_status ('', 0);

  if (typeof FileReader !== 'undefined') {
    var ref = document.getElementById ('import_name');
    if (!ref) return;
    ref.files = null;
    ref.click ();
  } else {
    show_tab ('import');
  }
}

/* import file */

function import_file () {

  update_status ('', 0);

  /* get file name */
  var input = document.getElementById ('import_name');
  var file = input.files[0];
  var filename = file.name;
  if (filename.length == 0) {
    update_status ('please select a file!', 1);
    return;
  }

  /* read file */
  var reader = new FileReader();
  reader.onload = function(e) { import_proc (e.target.result); };
  reader.onerror = function(e) { update_status ('can\'t read file (' + e.target.error.code + ')', 1); };
  reader.readAsText (file);

  update_status ('file "' + filename + '" loading', 0);
}

/* export file */

function export_file () {

  var data = export_proc ();

  var filename;
  try {
    filename = export_filename;
  } catch (er) {
    filename = 'config.txt';
  }
  var dl_link = document.createElement ('a');
  dl_link.download = filename;
  dl_link.innerHTML = 'Download File';
  try {
    var fd_blob = new Blob ([data], {type: 'text/plain;charset=UTF-8'});
    if (window.webkitURL != null) { /* Chrome */
      dl_link.href = window.webkitURL.createObjectURL (fd_blob);
    } else { /* Firefox */
      dl_link.href = window.URL.createObjectURL (fd_blob);
      dl_link.onclick = function (event) { document.body.removeChild (event.target); };
      dl_link.style.display = 'none';
      document.body.appendChild (dl_link);
    }
    dl_link.click();
  } catch (er) {
    show_tab ('export');
    document.getElementById ('export_data').value = data;
  }

  update_status ('export DHCPD configuration successfully completed', 0);

  return '';
}

/* load function */

function load_file_chromeos2 () {

  /* check that nothing has already been requested */
  if (last_action !== '') {
    window.alert ('Action <' + last_action + '> is not yet finished, please wait before starting something else!');
    return;
  }
  last_action = 'chromeos2';

  /* update status */
  update_status ('loading DHCPD configuration file', 0);

  /* create request message */
  var params = 'action=chromeos2';
  var rxfunc = function (message) {
    var stat = message.getElementsByTagName ('stat')[0].firstChild.nodeValue;
    if (stat == 0) {
      var data = message.getElementsByTagName ('data')[0].firstChild.nodeValue;
      import_proc (base64_decode (data));
    } else {

      /* update status on error */
      update_status ('error while loading DHCPD configuration file (' + stat + ')', 2);
    }
    last_action = '';
  };

  ajax_post (params, rxfunc);

  return '';
 
}

function load_file_chromeos4 () {

  /* check that nothing has already been requested */
  if (last_action !== '') {
    window.alert ('Action <' + last_action + '> is not yet finished, please wait before starting something else!');
    return;
  }
  last_action = 'chromeos4';

  /* update status */
  update_status ('loading DHCPD configuration file', 0);

  /* create request message */
  var params = 'action=chromeos4';
  var rxfunc = function (message) {
    var stat = message.getElementsByTagName ('stat')[0].firstChild.nodeValue;
    if (stat == 0) {
      var data = message.getElementsByTagName ('data')[0].firstChild.nodeValue;
      import_proc (base64_decode (data));
    } else {

      /* update status on error */
      update_status ('error while loading DHCPD configuration file (' + stat + ')', 2);
    }
    last_action = '';
  };

  ajax_post (params, rxfunc);

  return '';
 
}

function load_file_chromeos6 () {

  /* check that nothing has already been requested */
  if (last_action !== '') {
    window.alert ('Action <' + last_action + '> is not yet finished, please wait before starting something else!');
    return;
  }
  last_action = 'chromeos6';

  /* update status */
  update_status ('loading DHCPD configuration file', 0);

  /* create request message */
  var params = 'action=chromeos6';
  var rxfunc = function (message) {
    var stat = message.getElementsByTagName ('stat')[0].firstChild.nodeValue;
    if (stat == 0) {
      var data = message.getElementsByTagName ('data')[0].firstChild.nodeValue;
      import_proc (base64_decode (data));
    } else {

      /* update status on error */
      update_status ('error while loading DHCPD configuration file (' + stat + ')', 2);
    }
    last_action = '';
  };

  ajax_post (params, rxfunc);

  return '';
 
}

/* save function */

function save_file () {

  /* check that nothing has already been requested */
  if (last_action !== '') {
    window.alert ('Action <' + last_action + '> is not yet finished, please wait before starting something else!');
    return;
  }

  /* update status */
  update_status ('', 0);

  /* confirmation window */
  if (!window.confirm ('Do you really want to update DHCPD configuration file on server?'))
    return;
  last_action = 'save';

  /* update status */
  update_status ('saving DHCPD configuration file', 0);

  /* create csv data */
  var data = export_proc ();
  if (data.length == 0)
    return 'cancel';

  /* create request message */
  var params = 'action=save&data=' + base64_encode (data);
  var rxfunc = function (message) {
    var stat = message.getElementsByTagName ('stat')[0].firstChild.nodeValue;
    if (stat == 0) {
      /* update status on success */
      update_status ('DHCPD configuration file saved', 0);
    } else {
      /* update status on error */
      update_status ('error while saving DHCPD configuration file (' + stat + ')', 2);
    }
    last_action = '';
  };

  ajax_post (params, rxfunc);

  return '';
}

/* apply function */

function apply_file () {

  /* check that nothing has already been requested */
  if (last_action !== '') {
    window.alert ('Action <' + last_action + '> is not yet finished, please wait before starting something else!');
    return;
  }
  update_status ('', 0);

  /* confirmation window */
  if (!window.confirm ('Do you really want to restart DHCPD daemon on server?'))
    return;
  last_action = 'apply';

  /* update status */
  update_status ('apply modifications', 0);

  /* create request message */
  var params = 'action=apply';
  var rxfunc = function (message) {
    var stat = message.getElementsByTagName ('stat')[0].firstChild.nodeValue;
    if (stat == 0) {
      /* update status on success */
      update_status ('DHCPD daemon restarted', 0);
    } else {
      /* update status on error */
      update_status ('error while restarting DHCPD daemon (' + stat + ')', 2);
    }
    last_action = '';
  };

  ajax_post (params, rxfunc);

  return '';
}

/* go to url */

function goto_url (url) {
  var url_link = document.createElement ('a');
  url_link.href = url;
  url_link.innerHTML = 'Go to URL';
  url_link.style.display = 'none';
  document.body.appendChild (url_link);
  url_link.click ();
}
