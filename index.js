$(document).ready(function () {
  $('#next').click(function () {
    $('#cover').hide()
    $('#form').show()
  })

  function validarCPF(cpf) {	
    cpf = cpf.replace(/[^\d]+/g,'');	
    if(cpf == '') return false;	
    // Elimina CPFs invalidos conhecidos	
    if (cpf.length != 11 || 
      cpf == "00000000000" || 
      cpf == "11111111111" || 
      cpf == "22222222222" || 
      cpf == "33333333333" || 
      cpf == "44444444444" || 
      cpf == "55555555555" || 
      cpf == "66666666666" || 
      cpf == "77777777777" || 
      cpf == "88888888888" || 
      cpf == "99999999999")
        return false;		
    // Valida 1o digito	
    add = 0;	
    for (i=0; i < 9; i ++)		
      add += parseInt(cpf.charAt(i)) * (10 - i);	
      rev = 11 - (add % 11);	
      if (rev == 10 || rev == 11)		
        rev = 0;	
      if (rev != parseInt(cpf.charAt(9)))		
        return false;		
    // Valida 2o digito	
    add = 0;	
    for (i = 0; i < 10; i ++)		
      add += parseInt(cpf.charAt(i)) * (11 - i);	
    rev = 11 - (add % 11);	
    if (rev == 10 || rev == 11)	
      rev = 0;	
    if (rev != parseInt(cpf.charAt(10)))
      return false;		
    return true;   
  }

  function validarCep (cep) {
    var validacep = /^[0-9]{8}$/
    return validacep.test(cep)
  }

  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  $('#cpf').focusout(function () {
    let cpf = $(this).val()
    if (validarCPF(cpf)) {
      $.ajax({
        url: 'https://talentodeseguros-server.herokuapp.com/cpf/' + cpf,
        dataType: 'json',
        success: function(data){
          console.log('data', data)
          $('#nome_completo').val(data.NOME_COMPLETO)
          $('#nome_corretora').val(data.CORRETORA)
          $('#email').val(data['E-MAIL'])
          $('#telefone').val(data.TELEFONE)
          $('#regional').val(data.SUCURSAL)
        }
      })
    } else { 
      console.log('teste')
    }
  })
  
  $("#cep").focusout(function(){
		//Início do Comando AJAX
		$.ajax({
			url: 'https://viacep.com.br/ws/'+$(this).val()+'/json/unicode/',
			dataType: 'json',
			success: function(resposta){
				$("#logradouro").val(resposta.logradouro);
				$("#complemento").val(resposta.complemento);
				$("#bairro").val(resposta.bairro);
				$("#cidade").val(resposta.localidade);
				$("#uf").val(resposta.uf);
				$("#numero").focus();
			}
		})
  })

  function checkAllFields (obj) {
    return {
      'cpf': (obj.cpf !== '' && validarCPF(obj.cpf)),
      'email': (obj.email !== '' && validateEmail(obj.email)),
      'nome_completo': (obj.nome_completo !== '' && obj.nome_completo !== null),
      'nome_corretora': (obj.nome_corretora !== '' && obj.nome_corretora !== null),
      'regional': (obj.regional !== '' && obj.regional !== null),
      'telefone': (obj.telefone !== ''),
      'cep': (obj.cep !== ''),
      'logradouro': (obj.logradouro !== ''),
      'numero': (obj.numero !== ''),
      'complemento': (obj.complemento !== ''),
      'bairro': (obj.bairro !== ''),
      'uf': (obj.uf !== ''),
      'voltagem': (obj.voltagem !== ''),
      'brinde': (obj.brinde !== '')
    }
  }
  
  $('#submit').click(function () {
    let cpf = $('#cpf').val()
    let nome_completo = $('#nome_completo').val()
    let nome_corretora = $('#nome_corretora').val()
    let regional = $('#regional').val()
    let email = $('#email').val()
    let telefone = $('#telefone').val()
    let cep = $('#cep').val()
    let logradouro = $('#logradouro').val()
    let numero = $('#numero').val()
    let complemento = $('#complemento').val()
    let bairro = $('#bairro').val()
    let uf = $('#uf').val()
    let voltagem = $("input[name=voltagem]").val()
    let brinde = $("input[name=brinde]").val()
    
    
    let obj = {cpf, nome_completo, nome_corretora, regional, email, telefone, cep, logradouro, numero, complemento, bairro, uf, voltagem, brinde}
    console.log('obj', obj, validarCPF(obj.cpf))
    let validFields = checkAllFields(obj)
    console.log('isvalid', validFields)

    let allValid = true
    for (i in validFields) {
      console.log('validFields', i)
      let el = $('#' + i)
      el.removeClass('is-valid')
      el.removeClass('is-invalid')
      if(validFields[i]) {
        allValid = true && allValid
        el.addClass('is-valid')
      } else {
        allValid = false && allValid
        el.addClass('is-invalid')
      }
    }
    console.log('valid', allValid)
    
    if (allValid) {
      $.ajax({
        url: "https://talentodeseguros-server.herokuapp.com/participante/" + JSON.stringify(obj),
        type: "POST",
        success: function(resposta){
          $('#successModal').modal('show')
        },
        dataType: 'json'
      })
    }
  })
})