function formSignUp() {
  let forms = document.querySelectorAll("[data-form-container]:not(.js-running)");
  forms.forEach((containerForm) => {
    containerForm.classList.add("js-running");
    containerForm.querySelector("form").addEventListener("submit", function(e) {
      e.preventDefault();
      containerForm.querySelector(".feedback-sign-up").classList.add("d-none");
      {
        containerForm.dataset.formState = "success";
        containerForm.querySelector(".feedback-sign-up").classList.remove("d-none");
        containerForm.querySelector(".feedback-sign-up").innerHTML = "Message sent!";
      }
    });
  });
}
formSignUp();
document.addEventListener("pjax:complete", formSignUp);
