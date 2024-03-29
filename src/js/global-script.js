$( document ).ready(function() {

  // Поиск: поведение шапки-формы
  (function () {

    // Клик на "Показать все" в тегах для быстрого поиска
    const allSearchTags = document.querySelectorAll('.search-tags');

    allSearchTags.forEach(searchTags => {
      const showAllBtn = searchTags.querySelector('.search-tags__show-all');
      const allTags = searchTags.querySelectorAll('.search-tags__item');
      const counter = searchTags.dataset.showCounter;

      showAllBtn.addEventListener('click', () => {
        let showAllState = !searchTags.querySelectorAll('.search-tags__item--hidden').length;
        const showText = showAllBtn.dataset.showText;
        const hideText = showAllBtn.dataset.hideText;

        if (showAllState) {
          showAllBtn.innerHTML = showText;

          allTags.forEach((hiddenTag, i) => {
            if (i >= counter) {
              hiddenTag.classList.add('search-tags__item--hidden');
            }
          });
        }
        else {
          showAllBtn.innerHTML = hideText;

          allTags.forEach((hiddenTag) => {
            hiddenTag.classList.remove('search-tags__item--hidden');
          });
        }

        setSearchGeometry();
        setPadding();
      })
    });
    // END Клик на "Показать все" в тегах для быстрого поиска

    // Подсчеты и изменения при скролле
    var formHeight = 0;
    var formFilterHeight = 0;

    var setPadding = function() {
      $('#locations-list').css({
        paddingTop: formHeight + 'px',
      });
    };

    var setSearchGeometry = function(){
      var block = $('#filter-wrapper');
      formHeight = Math.ceil($(block).height());
      formFilterHeight = Math.ceil($(block).find('.filter-wrapper__inner').height());
    };

    setSearchGeometry();
    setPadding();

    $(window).on('resize', function() {
      setSearchGeometry();
      setPadding();
    });

    $(window).on('scroll', function() {
      var scroll = window.pageYOffset;
      var maxTranslateY = formHeight - formFilterHeight;
      var translateY = scroll > maxTranslateY ? maxTranslateY : scroll;

      $('#filter-wrapper').css({
        transform: 'translateY(' + translateY * -1 +'px)',
      });
    });
  })();

  // фиксация сайдбара на странице объекта
  var Sticky = new hcSticky('.object-price-data', {
    stickTo: '.layout-object__aside',
    top: 56,
    responsive: {
      969: {
        disable: true
      }
    }
  });

  new hcSticky('.layout-tabs__aside--sticky', {
    stickTo: '.layout-tabs__tab--akinita-aside',
    top: 56,
    responsive: {
      969: {
        disable: true
      }
    }
  });

  // Клик на кнопке показа формы поиска (мобилка)
  $('#search-form-2-trigger').on('click', function(){
    $('#search-form-2-form').toggleClass('search-form-2__form--shown');
  });

  // Поля формы с выбором кол-ва
  var fieldsNum = document.querySelectorAll( '.field-num' );
  if(fieldsNum.length) {
    Array.prototype.forEach.call( fieldsNum, function( field ) {
      const input = field.querySelector('.field-num__input');
      const text = field.querySelector('.field-num__text-num');
      const valueMin = input.getAttribute('min') ? +input.getAttribute('min') : -Infinity;
      const valueMax = input.getAttribute('max') ? +input.getAttribute('max') : Infinity;
      const valueStep = input.getAttribute('step') ? +input.getAttribute('step') : 1;
      field.addEventListener('click', function(event){
        if(event.target.classList.contains('field-num__btn') && !input.getAttribute('disabled')) {
          var num = parseInt(input.value);
          if(isNaN(num)) num = 0;
          if(event.target.classList.contains('field-num__btn--plus')) {
            if (num < valueMax) input.value = num + valueStep;
          }
          if(event.target.classList.contains('field-num__btn--minus')) {
            if (num > valueMin) input.value = num - valueStep;
          }
          if(text) {
            text.innerText = new Intl.NumberFormat('en-IN').format(input.value);
          }
        }
      });
    });
  }

  // Работа аккордеона
  $('.accordeon__btn').on('click', function(e){
    e.stopPropagation();
    $(this).closest('.accordeon').toggleClass('open').find('.accordeon__drop').slideToggle();
  });

  // Переключение вкладок в форме добавления локации
  $(document).on('click', '.steps-add__item.steps-add__item--done', function (e) {
    e.preventDefault();
    if($(this.hash).is(':hidden')) {
      $('.add-form__part:visible').hide();
      $(this.hash).fadeIn();
      $('.steps-add__item').removeClass('steps-add__item--active');
      $(this).addClass('steps-add__item--active');
    }
    checkVisibleSendBtn();
    checkDisabledBackBtn();
  });

  // Сортировка фото
  $( "#sortable-phohos" ).sortable().disableSelection();

  // Показ/сокрытие подсказки на карте
  $('#map-help-toggler').on('change', function(){
    if($(this).is(':checked')) {
      $('#map-help').addClass('add-form__map-help-wrap--shown');
    }
    else {
      $('#map-help').removeClass('add-form__map-help-wrap--shown');
    }
  });

  // Наведение на карту
  $('#map-help').hover(function(){
    $('#map-help-toggler').prop('checked', false);
    $(this).removeClass('add-form__map-help-wrap--shown');
  });

  // клик на Next
  $('[data-add-form-next]').on('click',function(){
    if( $(window).scrollTop() > 60 ) {
      $('body,html').animate({'scrollTop':0}, 250);
      $('body').delay(250).queue(function () {
        unnecessaryAnimation();
        console.log(222);
        $(this).dequeue();
      });
    }
    else {
      $(window).scrollTop(0);
      unnecessaryAnimation();
    }
  });
  function unnecessaryAnimation(){
    var thisItemLink = $('.steps-add__item--active');
    var nextItemLink = thisItemLink.closest('.steps-add__item-wrap').next().find('.steps-add__item');
    // Убираем класс активности, добавляем класс завершенности (содержит 1 цикл анимации)
    thisItemLink.removeClass('steps-add__item--active').addClass('steps-add__item--done').delay(300).queue(function () {
      $(thisItemLink.attr('href')).hide();
      $(nextItemLink.attr('href')).fadeIn();
      nextItemLink.addClass('steps-add__item--active steps-add__item--done');
      checkVisibleSendBtn();
      checkDisabledBackBtn();
      $(this).dequeue();
    });
  }

  // Клик на Back
  $('[data-add-form-back]').on('click',function(){
    if( $(window).scrollTop() > 60 ) {
      $('body,html').animate({'scrollTop':0}, 250);
      $('body').delay(250).queue(function () {
        clickOnBackBtn();
        $(this).dequeue();
      });
    }
    else {
      $(window).scrollTop(0);
      clickOnBackBtn();
    }
  });
  function clickOnBackBtn(){
    var thisItemLink = $('.steps-add__item--active');
    var prevItemLink = thisItemLink.closest('.steps-add__item-wrap').prev().find('.steps-add__item');
    thisItemLink.removeClass('steps-add__item--active').closest('.steps-add__item-wrap').prev().find('.steps-add__item').addClass('steps-add__item--active');
    $(thisItemLink.attr('href')).hide();
    $(prevItemLink.attr('href')).fadeIn();
    checkVisibleSendBtn();
    checkDisabledBackBtn();
  }

  // Проверка нужно ли блокировать кнопку Back
  function checkDisabledBackBtn(){
    if( !$('.steps-add__item--active').closest('.steps-add__item-wrap').prev().length ){
      $('[data-add-form-back]').attr('disabled', true);
    }
    else {
      $('[data-add-form-back]').attr('disabled', false);
    }
  }

  // Проверка нужно ли показывать кнопку отправки вместо Next
  function checkVisibleSendBtn(){
    if( !$('.steps-add__item--active').closest('.steps-add__item-wrap').next().length ){
      $('[data-add-form-next]').hide();
      $('[data-add-form-send]').show();
      $('.steps-add__item--active').addClass('steps-add__item--done');
    }
    else {
      $('[data-add-form-next]').show();
      $('[data-add-form-send]').hide();
    }
  }

  // ВРЕМЕННО: блокировка кнопки отправки формы
  $('[data-add-form-send]').on('click', function(e){e.preventDefault();});





  // узнаем ширину скролла
  var div = document.createElement('div');
  div.style.overflowY = 'scroll';
  div.style.width = '50px';
  div.style.height = '50px';
  div.style.visibility = 'hidden';
  document.body.appendChild(div);
  var scrollWidth = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);

  // отмена закрытия бутстраповского дропдауна с чекбоксами
  $(document).on('click', '.field-drop-checkboxes__drop', function (e) {
    e.stopPropagation();
  });

  // бутстраповские тултипы
  // $('[data-toggle="tooltip"]').tooltip();
  function tooltipsInit(){
    var containerWidth = $(window).width() + scrollWidth;
    if(containerWidth >= 1170) {
      $('[data-toggle="tooltip"]:not(.tooltip-all)').tooltip();
    } else {
      $('[data-toggle="tooltip"]:not(.tooltip-all)').tooltip('destroy');
    }
  }
  var tooltipsTimeoutId;
  $(window).resize( function() {
    clearTimeout(tooltipsTimeoutId);
    tooltipsTimeoutId = setTimeout(tooltipsInit, 200);
  });
  tooltipsInit();
  $('.tooltip-all').tooltip();

  // включение полифила для object-fit: cover; в днищебраузерах
  objectFitImages();

  // включение датапикера в модальном окне и блокировка нескольких дат
  /*  // Alekos: Временно убрал инициализацию календаря - перенёс на нужные страницы.
  $('#shedule-calendar').dateRangePicker({
    inline: true,
    container: '#shedule-calendar',
    extraClass: 'inline-wrapper--modal',
    alwaysOpen: true,
    singleMonth: true,
    showShortcuts: false,
    showTopbar: false,
    startDate: '2017-08-20',
  });
  */

  // карусели в блоках Top Rated
  var $topRatedCarousel = $('.top-rated__list--carousel');
  var topRatedCarouselSettings = {
    margin: 15,
    autoWidth: true,
    dots: false,
    // loop: true,
  };
  function topRatedCarouselInit(){
    var containerWidth = $(window).width() + scrollWidth;
    // console.log('$(document).width(): '+containerWidth);
    if(containerWidth <= 969) {
      $topRatedCarousel.owlCarousel( topRatedCarouselSettings );
    } else {
      $topRatedCarousel.trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
      $topRatedCarousel.find('.owl-stage-outer').children().unwrap();
    }
  }
  var topRatedTimeoutId;
  $(window).resize( function() {
    clearTimeout(topRatedTimeoutId);
    topRatedTimeoutId = setTimeout(topRatedCarouselInit, 200);
  });
  topRatedCarouselInit();

  // карусель отзывов
  $('#feedback-slider').owlCarousel({
    responsive : {
      0 : {
        autoWidth: true,
        loop: true,
      },
      1170 : {
        autoWidth: false,
        items: 3,
        loop: true,
      },
    }
  });
  $('#feedback-slider-next').on('click', function(e){
    e.preventDefault();
    $('#feedback-slider').trigger('next.owl.carousel');
  });
  $('#feedback-slider-prev').on('click', function(e){
    e.preventDefault();
    $('#feedback-slider').trigger('prev.owl.carousel');
  });

  // дроп фильтра товаров
  $('[data-filter-drop-toggler]').on('click', function(e){
    e.preventDefault();
    $('#filter-drop').toggleClass('modal-mobile--open').toggleClass('filter__drop--open');
    $('#filter-wrapper').toggleClass('filter-wrapper--open-drop');
  });

  // карусель фоток в блоке над картой
  $('.card-map__carousel.owl-carousel').owlCarousel({
    items: 1,
    nav: true,
  });

  // карусель фоток в блоке локации
  $('.card__photo-carousel.owl-carousel').owlCarousel({
    items: 1,
    nav: true,
    lazyLoad: true,
    loop: true,
  });

  // блоки, висящие над картой (клик для смены представления и модального окна на мобилке)
  $('[data-card-map-toggle]').on('click', function(e){
    e.preventDefault();
    var parent = $(this).closest('.card-map-wrap');
    $(parent).find('.card-map-wrap__item').toggleClass('card-map-wrap__item--shown');
    var locationId = $(this).closest('[data-location-id]').data('location-id');
    $('body').toggleClass('modal-map-open');
  });
  // переключение видимости модального окна, заменяющего собой блок на карте
  $('[data-modal-mobile-toggle]').on('click', function(e){
    e.preventDefault();
    var modal = $(this).closest('.modal-map');
    var locationId = $(modal).data('location-id-mobile');
    var parent = $('.card-map-wrap').filter('[data-location-id='+locationId+']');
    $('body').toggleClass('modal-map-open');
    $(parent).find('.card-map-wrap__item').toggleClass('card-map-wrap__item--shown');
  });
  // закрытие видимости модального окна, заменяющего собой блок на карте
  $('[data-modal-mobile-close]').on('click', function(e){
    e.preventDefault();
    var modal = $(this).closest('.modal-map');
    var locationId = $(modal).data('location-id-mobile');
    var parent = $('.card-map-wrap').filter('[data-location-id='+locationId+']');
    $('body').removeClass('modal-map-open');
    $(parent).find('.card-map-wrap__item').removeClass('card-map-wrap__item--shown');
  });

  // карусель в контенте
  var contentCarousel = $('.gallery-content__carousel.owl-carousel');
  $(contentCarousel).owlCarousel({
    items: 1,
    nav: true,
    autoHeight: true,
  });

  // плавный скролл для якорных ссылок
  $('a[href^="#"]:not([data-toggle]):not([data-no-scroll])').on('click',function(e){
    const isMainMenuLink = $(this).closest('.main-nav');
    if (isMainMenuLink) return;
    var target_position = $(this.hash).offset().top - 56; // 56 — высота хедера, прибитого к верху вьюпорта
    $('body,html').animate({'scrollTop':target_position},350);
  });

  // оставнока воспроизведения видео при закрытии модального окна
  $('.modal--video').on('hidden.bs.modal', function (e) {
    var src = $(this).find('iframe').attr('src');
    $(this).find('iframe').attr('src', '');
    $(this).find('iframe').attr('src', src);
  });

  // карусель фоток в блоке internal-property
  $('.main-pict__carousel.owl-carousel').owlCarousel({
    items: 1,
    nav: true,
    autoHeight: true,
  });

  // карусель фоток в блоке internal-property
  $('.gallery-modal__carousel.owl-carousel').owlCarousel({
    items: 1,
    nav: true,
    autoHeight: true,
  });

  // карусель фоток в блоке internal-property
  $('.gallery-modal__carousel-prew.owl-carousel').owlCarousel({
    items: 5,
    // center: true,
    nav: false,
    autoWidth:true,
    margin: 20,
  });

  // переключение видимости блоков в сайдбаре
  $('.aside-block__header-toggler').on('click', function(){
    $(this).closest('.aside-block--collapsable').toggleClass('aside-block--collapse');
  });

  // слайдеры для блока mortgage в сайдбаре
  /* //Alekos: Перенёс инициализацию слайдеров на internal property только для недвижимости на продажу
     // там же обрабатываются события от слайдеров и пересчитываются параметры кредита.
  var handle1 = $( "#custom-handle-1 .field-range-jquery-ui__num" );
  $( "#slider-1" ).slider({
    create: function() { handle1.text( $( this ).slider( "value" ) + ' %' ); },
    slide: function( event, ui ) { handle1.text( ui.value + ' %' ); }
  });
  var handle2 = $( "#custom-handle-2 .field-range-jquery-ui__num" );
  $( "#slider-2" ).slider({
    create: function() { handle2.text( $( this ).slider( "value" ) + ' years' ); },
    slide: function( event, ui ) { handle2.text( ui.value + ' years' ); }
  });
  var handle3 = $( "#custom-handle-3 .field-range-jquery-ui__num" );
  $( "#slider-3" ).slider({
    create: function() { handle3.text( $( this ).slider( "value" ) + ' %' ); },
    slide: function( event, ui ) { handle3.text( ui.value + ' %' ); }
  });
  */

  // выбор дат в блоке сайдбара c jQuery UI calendar
  // var array = ["2017-08-14","2017-08-15","2017-08-16"]
  // $("#datepicker-1, #datepicker-2").datepicker({
  //   beforeShowDay: function(date){
  //     var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
  //     return [ array.indexOf(string) == -1 ]
  //   }
  // });

  // выбор дат в блоке сайдбара c jQuery Date Range Picker
  /* //Alekos: Перенёс инициализацию календарей на нужные страницы.
  $("#datepicker-1").dateRangePicker({
    container: '#availability-date-start',
    extraClass: 'date-picker-wrapper--aside  date-picker-wrapper--aside-start',
    autoClose: true,
    singleDate : true,
    singleMonth: true,
    showShortcuts: false,
    startDate: '2017-08-20',
    showTopbar: false,
  });
  $("#datepicker-2").dateRangePicker({
    container: '#availability-date-end',
    extraClass: 'date-picker-wrapper--aside  date-picker-wrapper--aside-end',
    autoClose: true,
    singleDate : true,
    singleMonth: true,
    showShortcuts: false,
    startDate: '2017-08-20',
    showTopbar: false,
  });

  // выбор дат в модальном окне c jQuery Date Range Picker
  $("#datepicker-3").dateRangePicker({
    container: '#modal-availability-date-start',
    extraClass: 'date-picker-wrapper--modal  date-picker-wrapper--modal-start',
    autoClose: true,
    singleDate : true,
    singleMonth: true,
    showShortcuts: false,
    startDate: '2017-08-20',
    showTopbar: false,
  }).on('datepicker-open',function(){ // на мобилке два поля друг под другом, так что придется добавлять/убирать класс-модификатор, увеличивающий z-index
      $(this).closest('.field-text').addClass('field-text--datapicker-active');
  }).on('datepicker-closed',function(){
    $(this).closest('.field-text').removeClass('field-text--datapicker-active');
  });
  $("#datepicker-4").dateRangePicker({
    container: '#modal-availability-date-end',
    extraClass: 'date-picker-wrapper--modal  date-picker-wrapper--modal-end',
    autoClose: true,
    singleDate : true,
    singleMonth: true,
    showShortcuts: false,
    startDate: '2017-08-20',
    showTopbar: false,
  });

  // инлайновый календарь для страницы выбора дат при добавлении цен за конкретные даты
  $('#calendar-prices').dateRangePicker({
    inline: true,
    container: '#calendar-prices',
    alwaysOpen: true,
    singleMonth: true,
    showShortcuts: false,
    showTopbar: false,
    startDate: '2017-08-20',
  });
  */



  // NOTE[@nicothin]: 3 05 22 +

  $('.js-explore-items-carousel').owlCarousel({
    responsive: {
      0: {
        // autoWidth: false,
        items: 1,
        loop: true,
      },
      768: {
        // autoWidth: false,
        items: 2,
        loop: true,
        margin: 24,
      },
      1170: {
        // autoWidth: false,
        items: 3,
        loop: true,
        margin: 24,
      },
    }
  });
  $(document).on('click', '.js-explore-items-btn-left, .js-explore-items-header-btn-left', function (e) {
    e.preventDefault();
    $(this).closest('.explore-items').find('.owl-carousel').trigger('prev.owl.carousel');
  });
  $(document).on('click', '.js-explore-items-btn-right, .js-explore-items-header-btn-right', function (e) {
    e.preventDefault();
    $(this).closest('.explore-items').find('.owl-carousel').trigger('next.owl.carousel');
  });



  $('.js-explore-items-carousel-short').owlCarousel({
    responsive: {
      0: {
        autoWidth: true,
        dots: false,
        loop: true,
      },
      1170: {
        items: 3,
        loop: true,
        margin: 24,
      },
    }
  });
  $(document).on('click', '.js-explore-items-btn-left', function (e) {
    e.preventDefault();
    $(this).closest('.explore-items').find('.owl-carousel').trigger('prev.owl.carousel');
  });
  $(document).on('click', '.js-explore-items-btn-right', function (e) {
    e.preventDefault();
    $(this).closest('.explore-items').find('.owl-carousel').trigger('next.owl.carousel');
  });



  const $newlyListedCarousel = $('.listed-homes__list');
  const newlyListedCarouselSettings = {
    responsive: {
      0: {
        autoWidth: true,
        dots: false,
        loop: true,
      },
      1170: {
        items: 3,
        loop: true,
        margin: 24,
      },
    }
  };
  $newlyListedCarousel.each(function() {
    $(this).owlCarousel(newlyListedCarouselSettings);
  });
  $(document).on('click', '.listed-homes__carousel-btn-left', function (e) {
    e.preventDefault();
    $(this).closest('.listed-homes__list-inner').find('.owl-carousel').trigger('prev.owl.carousel');
  });
  $(document).on('click', '.listed-homes__carousel-btn-right', function (e) {
    e.preventDefault();
    $(this).closest('.listed-homes__list-inner').find('.owl-carousel').trigger('next.owl.carousel');
  });

  $('.simple-text__readmore').on('click', function() {
    $(this).closest('.simple-text').find('.simple-text__hidden').slideDown();
    $(this).closest('.simple-text__readmore-wrap').hide();
  });



  $('[data-toggle="collapse-other-offers"]').on('click', function() {
    $('#other-offers').slideToggle();
    if (this.classList.contains('other-offers-hide')) $(this).find('[data-text]').text(this.dataset.show);
    else $(this).find('[data-text]').text(this.dataset.hide);
    $(this).toggleClass('other-offers-hide');
  });



  $('.new-submenu__list a').on('click', function(e) {
    e.preventDefault();

    $('.new-submenu__active-link').removeClass('new-submenu__active-link');
    $(this).closest('a').addClass('new-submenu__active-link');

    const target = this.closest('a').attributes.href.value;
    $('.new-submenu__content--open').removeClass('new-submenu__content--open');
    $('.new-submenu__content--xl-open').removeClass('new-submenu__content--xl-open');
    $(target).addClass('new-submenu__content--open new-submenu__content--xl-open');

    $('.new-submenu__sublist > li > a').removeClass('new-submenu__active-link new-submenu__xl-active-link');
    $('.new-submenu__subcontent--xl-shown').removeClass('new-submenu__subcontent--xl-shown');
    const link = $(target).find('.new-submenu__sublist > li:first-child > a');
    $(link).addClass('new-submenu__xl-active-link').siblings('.new-submenu__subcontent').addClass('new-submenu__subcontent--xl-shown');
  });
  $('[data-main-nav-new-submenu-hide]').on('click', function (e) {
    e.preventDefault();
    $('.new-submenu__content--open').removeClass('new-submenu__content--open');
    $('.new-submenu__active-link').removeClass('new-submenu__active-link');
    $('.new-submenu__subcontent').hide();
  });

  $('.new-submenu__sublist a').on('click', function(e) {
    e.preventDefault();
    $('.new-submenu__sublist > li > a').removeClass('new-submenu__active-link new-submenu__xl-active-link');
    $(this).closest('a').addClass('new-submenu__active-link  new-submenu__xl-active-link');

    $('.new-submenu__subcontent--xl-shown').removeClass('new-submenu__subcontent--xl-shown');
    const target = e.target.attributes.href.value;
    $(target).addClass('new-submenu__subcontent--xl-shown');
    $('.new-submenu__subcontent--xl-shown').slideDown();
    $('.new-submenu__subcontent:not(.new-submenu__subcontent--xl-shown)').slideUp();
  });



  $('a[data-show-regions-details]').on('click', (e) => {
    e.preventDefault();
    const target = e.target.closest('a').attributes.href.value;
    $('.regions-details--shown').removeClass('regions-details--shown');
    $(target).addClass('regions-details--shown');
    $('.regions').addClass('regions--hidden');
    $('.page__wide-filter').hide();
  });
  $('a[data-hide-regions-details]').on('click', (e) => {
    e.preventDefault();
    $('.regions-details--shown').removeClass('regions-details--shown');
    $('.regions').removeClass('regions--hidden');
    $('.page__wide-filter').show();
  });
  $('.regions-details__list-primary a').on('click', (e) => {
    e.preventDefault();
    const parent = $(e.target).closest('.regions-details__wrapper');
    $(parent).find('.regions-details__list-secondary').removeClass('regions-details__list-secondary--shown');
    $(parent).find('.regions-details__list-primary-link--active').removeClass('regions-details__list-primary-link--active');
    $(e.target.closest('a')).addClass('regions-details__list-primary-link--active');
    const target = e.target.closest('a').attributes.href.value;
    $(target).addClass('regions-details__list-secondary--shown');
    $('.regions-details').addClass('regions-details--mobile-hide');
    $(`.regions-details[data-regions-details-id="${target.replace(/#/, '')}"]`).addClass('regions-details--mobile-double-show');
  });
  $('a[data-hide-regions-cities]').on('click', (e) => {
    e.preventDefault();
    $('[data-regions-details-id').removeClass('regions-details--mobile-double-show');
    $('.regions-details--mobile-hide').removeClass('regions-details--mobile-hide');
  });
});
