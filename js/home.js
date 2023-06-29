window.onscroll = function() {
  var scrolled = window.pageYOffset || document.documentElement.scrollTop; // Получаем положение скролла
  if(scrolled !== 0){
    // Если прокрутка есть, то делаем блок прозрачным
    document.querySelector('.home-navbar').style.background = '#000';
  }else{
    // Если нет, то делаем его полностью видимым
    document.querySelector('.home-navbar').style.background = 'none';
  };
};