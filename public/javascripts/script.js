'use strict';

const data = {
  getCustomer: (id) => {
    if(! data.hasOwnProperty('customers')) {
      return undefined;
    }
    id = parseInt(id, 10);
    return data.customers
            .find(({ID}) => ID === id);
  }
};

const dataTemplate = ({ID, fName, lName}) =>
`
<div class="cutDiv">
  <p data-id="${ID}" class="fName">${fName}</p>
  <p class="lName">${lName}</p>
  <button data-id="${ID}" class="removeBtn">Remove</button>
  <button data-id="${ID}" class="updateBtn">Update</button>
</div>
`;

const renderCustomer = (customers, target) => {
  const html = customers.map(c => dataTemplate(c))
                        .join('');
  $(target).html(html);
  $('#cancel').on('click', () => $('#updateSection').hide());
  $('#addCusBtn').on('click', addCustomer);
  $('.removeBtn').on('click', ({target}) => {
    const {dataset: {id}} = target;
    removeCustomer(id);
  });
  $('.updateBtn').on('click', ({target}) => {
    const {dataset: {id}} = target;
    updateCustomer(id);
  });
};

const loadCustomer = () => {
  $.ajax({
    url: '/customer/load-customer',
    dataType: 'json',
    type: 'GET',
    success: function ({rows}) {
      data.customers = rows;
      renderCustomer(data.customers, '#custData');
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#custData').text(jqXHR.statusText);
      console.log('ERROR:', jqXHR, textStatus, errorThrown);
    }
  });
};

const addCustomer = () => {
  const newCustomer = {
    fName: document.querySelector('#fName').value,
    lName: document.querySelector('#lName').value
  };
  $.ajax({
    url: '/customer/add-customer',
    dataType: 'json',
    type: 'POST',
    data: newCustomer,
    success: function (data) {
      loadCustomer();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#custData').text(jqXHR.statusText);
      console.log("ERROR:", jqXHR, textStatus, errorThrown);
    }
  });
};

const removeCustomer = (id) => {
  $.ajax({
    url: '/customer/removeCustomer',
    dataType: 'json',
    type: 'POST',
    data: {id},
    success: function (data) {
      loadCustomer();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#custData').text(jqXHR.statusText);
      console.log("ERROR:", jqXHR, textStatus, errorThrown);
    }
  });
};

const updateCustomer = (id) => {
  $('#updateSection').show();
  $('#updateSection').addClass('updatePopup');

  const {fName, lName} = data.getCustomer(id);

  $('#updateFirst').val(fName);
  $('#updateLast').val(lName);
  $('#submit').attr('data-id', id);
};

$(document).ready(() => {
  $('#submit').on('click', () => {
    const newFirst = $('#updateFirst').val();
    const newLast = $('#updateLast').val();
    const id = $('#submit').attr('data-id');
    $.ajax({
      url: '/customer/updateCustomer',
      dataType: 'json',
      type: 'POST',
      data: {id, newFirst, newLast},
      success: function (data) {
        loadCustomer();
        $('#updateSection').hide();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#custData').text(jqXHR.statusText);
        console.log("ERROR:", jqXHR, textStatus, errorThrown);
      }
    });
  });
  loadCustomer();
});