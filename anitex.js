function Anitex(id)
{
  this.writeSpeed = 100;
  this.TextColor = ""
  this.domObj = document.getElementById(id);
  this._blank = true;
  this.displayCursor = false;
  this.ondone = null;
  this.pipeLine = new Array();
  this.lock = false;
}

Anitex.prototype._nextFunc = function() {
  var elem;

  if(this.pipeLine.length == 0)
    return;

  elem = this.pipeLine.shift();
  console.log(elem);

  if(elem.func == "write")
    this.write(elem.arg1);
  else if(elem.func == "clear")
    this.clear();
  else if(elem.func == "delay")
    this.delay(elem.arg1);
};
Anitex.prototype.write = function(str) {
  if(this.lock) {
    var tmp = {
      "func": "write",
      "arg1": str,
    };
    this.pipeLine.push(tmp);
    return;
  }
  this.lock = true;
  var i = 0;
  var len = str.length;
  var t = setInterval(function(ob) {
    var l;
    ob._blank = false;
    l = ob.domObj.innerHTML.length;
    if(ob.displayCursor) {
      ob.domObj.innerHTML = ob.domObj.innerHTML.substr(0, l-1) + str[i];
      ob.domObj.innerHTML += '_';
    } else
      ob.domObj.innerHTML += str[i];
    i++;
    if(i == len) {
      clearInterval(t);
      ob.lock = false;
      ob._nextFunc();
    }
  }, this.writeSpeed, this);
};

Anitex.prototype.delay = function(t) {
  if(this.lock) {
    var tmp = {
      "func": "delay",
      "arg1": t
    }
    this.pipeLine.push(tmp);
    return;
  }
  this.lock = true;
  setTimeout(function(ob) {
    ob.lock = false;
    ob._nextFunc();

  }, t, this);
};

Anitex.prototype.clear = function() {
  if(this.lock) {
    var tmp = {
      "func": "clear"
    };
    this.pipeLine.push(tmp);
    return;
  }
  this.lock = true;
  this.domObj.innerHTML = "";
  this.lock = false;
  this._nextFunc();
};