var API_URL = "http://localhost:5011/api";

$(document).ready(onPageLoad);

function onPageLoad() {
  showDate();

  // Check if user is already logged in
  var token = localStorage.getItem("token");
  if (token) {
    showWeatherPage();
  } else {
    showLoginPage();
  }

  // Button click events
  $("#loginBtn").click(onLoginClick);
  $("#registerBtn").click(onRegisterClick);
  $("#searchBtn").click(onSearchClick);
  $("#logoutBtn").click(onLogoutClick);
  $("#showRegister").click(function () {
    showRegisterPage();
  });
  $("#showLogin").click(function () {
    showLoginPage();
  });
}

// Show date
function showDate() {
  var today = new Date();
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  $("#date").text(today.toLocaleDateString("en-US", options));
}

// PAGE NAVIGATION

function showLoginPage() {
  $("#loginCard").show();
  $("#registerCard").hide();
  $("#weatherCard").hide();
}

function showRegisterPage() {
  $("#loginCard").hide();
  $("#registerCard").show();
  $("#weatherCard").hide();
}

function showWeatherPage() {
  $("#loginCard").hide();
  $("#registerCard").hide();
  $("#weatherCard").show();

  // Show user info
  var email = localStorage.getItem("email");
  var role = localStorage.getItem("role");
  $("#userEmail").text(email);
  $("#userRole").text(role);

  // Show admin section only for Admin
  if (role === "Admin") {
    $("#adminSection").show();
  } else {
    $("#adminSection").hide();
  }
}

// LOGIN

function onLoginClick() {
  var email = $("#loginEmail").val().trim();
  var password = $("#loginPassword").val().trim();


  if (email === "" || password === "") {
    $("#loginError").text("Please enter email and password");
    return;
  }

  $.ajax({
    url: API_URL + "/auth/login",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ email: email, password: password }),
    success: function (data) {
      console.log("Login success", data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);
      showWeatherPage();
    },
    error: function (err) {
      console.log("Login error", err);
      console.log("Response:", err.responseJSON);
      $("#loginError").text("Invalid email or password");
    },
  });
}

// REGISTER

function onRegisterClick() {
  var email = $("#registerEmail").val().trim();
  var password = $("#registerPassword").val().trim();
  var role = $("#registerRole").val();

  if (email === "" || password === "") {
    $("#registerError").text("Please enter email and password");
    return;
  }

  // Call register API
  $.ajax({
    url: API_URL + "/auth/register",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ email: email, password: password, role: role }),
    success: function (data) {
      console.log("Register success", data);
      $("#registerError").text("");
      alert("Registered successfully! Please login.");
      showLoginPage();
    },
    error: function (err) {
      console.log("Register error", err);
      $("#registerError").text(
        err.responseJSON?.errors?.join(", ") ||
          err.responseJSON?.message ||
          "Registration failed",
      );
    },
  });
}

// LOGOUT

function onLogoutClick() {
  // Remove token from localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("role");

  // Go back to login page
  showLoginPage();
}

// WEATHER SEARCH

function onSearchClick() {
  var city = $("#cityInput").val().trim();
  if (city === "") {
    showMessage("Please enter a city");
    return;
  }
  showMessage("Loading...");
  getWeather(city);
}

function getWeather(city) {
  // Get token from localStorage
  var token = localStorage.getItem("token");

  $.ajax({
    url: API_URL + "/weather/city/" + encodeURIComponent(city),
    type: "GET",
    // Send token in Authorization header
    headers: {
      Authorization: "Bearer " + token,
    },
    success: onApiSuccess,
    error: onApiError,
  });
}

function onApiSuccess(data) {
  console.log("SUCCESS", data);
  $("#temperature").text(data.temperatureC + "°C");
  $("#condition").text(data.conditionName);
  $("#humidity").text("Humidity: " + data.humidity + "%");
  $("#wind").text("Wind: " + data.windSpeedKmh + " kph");
  $("#weatherIcon").attr("src", data.iconUrl);
}

function onApiError(err) {
  console.log("ERROR", err);

  // If 401 - token expired or invalid
  if (err.status === 401) {
    showMessage("Session expired. Please login again.");
    onLogoutClick();
    return;
  }

  // If 403 - not authorized
  if (err.status === 403) {
    showMessage("You don't have permission to do this.");
    return;
  }

  showMessage("City not found. Please try again.");
}

function showMessage(msg) {
  $("#condition").text(msg);
}
