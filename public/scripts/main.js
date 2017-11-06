'use strict';

// Initializes RGBikes
function RGBikes() {
    this.checkSetup();
  
    // Shortcuts to DOM Elements.
    this.userPic = document.getElementById('user-pic');
    this.userName = document.getElementById('user-name');
    this.signInButton = document.getElementById('sign-in');
    this.signOutButton = document.getElementById('sign-out');
    this.signInSnackbar = document.getElementById('must-signin-snackbar');

    this.signOutButton.addEventListener('click', this.signOut.bind(this));
    this.signInButton.addEventListener('click', this.signIn.bind(this));
  
    this.initFirebase();
  }
  
  // Sets up shortcuts to Firebase features and initiate firebase auth.
RGBikes.prototype.initFirebase = function() {
    // Shortcuts to Firebase SDK features.
    this.auth = firebase.auth();
    this.database = firebase.database();
    this.storage = firebase.storage();
    // Initiates Firebase auth and listen to auth state changes.
    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
  };

  RGBikes.prototype.initdbuser = function(user) {
    this.dbuser = this.database.ref('users/' + user.uid);

    this.dbuser.update({
        'name' : user.displayName,
        'photoUrl' : user.photoURL || '/images/profile_placeholder.png',
      });

    this.presence = this.database.ref('users/' + user.uid + '/presence')
    this.presence.onDisconnect().remove();
    this.presence.set(true);
  }

  // Signs-in RGBikes.
  RGBikes.prototype.signIn = function() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    var provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
};

// Signs-out of RGBikes.
RGBikes.prototype.signOut = function() {
   // Sign out of Firebase.
   this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
RGBikes.prototype.onAuthStateChanged = function(user) {
  if (user) { // User is signed in!
    // Get profile pic and user's name from the Firebase user object.
    var profilePicUrl = user.photoURL;
    var userName = user.displayName;

    // Set the user's profile pic and name.
    this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    this.userName.textContent = userName;

    // Show user's profile and sign-out button.
    this.userName.removeAttribute('hidden');
    this.userPic.removeAttribute('hidden');
    this.signOutButton.removeAttribute('hidden');

    // Hide sign-in button.
    this.signInButton.setAttribute('hidden', 'true');

    this.initdbuser(user);

  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    this.userName.setAttribute('hidden', 'true');
    this.userPic.setAttribute('hidden', 'true');
    this.signOutButton.setAttribute('hidden', 'true');

    // Show sign-in button.
    this.signInButton.removeAttribute('hidden');
  }

  this.updateUserList();
};

// Returns true if user is signed-in. Otherwise false.
RGBikes.prototype.checkSignedIn = function() {
    if (this.auth.currentUser) {
      return true;
    }
};

RGBikes.prototype.updateUserList = function() {
  //make sure the user is signed in
  if (!this.checkSignedIn())
    return;

  //test generate list
  var users_tab = document.getElementById("users_online_tab");

  var listNode = document.createElement('div');
  //var attrib = document.createAttribute("class");
  //listNode.nodeValue = "demo-list-action mdl-list";
  listNode.setAttribute("class", "demo-list-action mdl-list");

  users_tab.appendChild(listNode);

  //this.ListCreateUser(listNode, this.auth.currentUser.displayName, this.auth.currentUser.profilePicUrl, this.dbuser.presence);
  this.ListCreateUser(listNode, "Gui", this.auth.currentUser.profilePicUrl, this.dbuser.presence);
  this.ListCreateUser(listNode, "Bob", this.auth.currentUser.profilePicUrl, this.dbuser.presence);
};

RGBikes.prototype.ListCreateUser = function(parent, name, pic, presence) {

  var listItem = document.createElement('div');
  listItem.setAttribute("class", "mdl-list__item");
  parent.appendChild(listItem);

  var itemContent = document.createElement('span');
  itemContent.setAttribute("class", "mdl-list__item-primary-content");
  listItem.appendChild(itemContent);

  var person = document.createElement('i');
  person.setAttribute("class", "material-icons mdl-list__item-avatar");
  person.nodeValue = 'person';
  itemContent.appendChild(person);

  var username = document.createElement('span');
  username.nodeValue = name;
  itemContent.appendChild(username);

};

  // Checks that the Firebase SDK has been correctly setup and configured.
RGBikes.prototype.checkSetup = function() {
    if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
      window.alert('You have not configured and imported the Firebase SDK. ' +
          'Make sure you go through the codelab setup instructions and make ' +
          'sure you are running the codelab using `firebase serve`');
    }
  };

window.onload = function() {
    window.RGBikes = new RGBikes();
  };
