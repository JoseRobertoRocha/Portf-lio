// Formulário de Contato com envio para WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('clientForm');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Número do WhatsApp (substitua pelo seu número)
    const whatsappNumber = '5575983130394'; // Seu número já usado no site
    
    // Função para formatar o número de telefone
    function formatarTelefone(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            if (value.length < 14) {
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            }
        }
        
        input.value = value;
    }
    
    // Adicionar máscara ao telefone
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', function() {
        formatarTelefone(this);
    });
    
    // Validação em tempo real
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
    
    // Função de validação individual
    function validateField(field) {
        const isValid = field.checkValidity();
        
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
        }
        
        return isValid;
    }
    
    // Função para validar todo o formulário
    function validateForm() {
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Função para coletar dados do formulário
    function coletarDadosFormulario() {
        const formData = new FormData(form);
        const dados = {};
        
        for (let [key, value] of formData.entries()) {
            dados[key] = value;
        }
        
        return dados;
    }
    
    // Função para formatar a mensagem para WhatsApp
    function formatarMensagemWhatsApp(dados) {
        let mensagem = `🎯 *NOVO CLIENTE - FORMULÁRIO DE CONTATO*\n\n`;
        
        mensagem += `👤 *DADOS PESSOAIS*\n`;
        mensagem += `• Nome: ${dados.nome}\n`;
        mensagem += `• E-mail: ${dados.email}\n`;
        mensagem += `• Telefone: ${dados.telefone}\n`;
        mensagem += `• Empresa: ${dados.empresa || 'Não informado'}\n\n`;
        
        mensagem += `💼 *SOBRE O PROJETO*\n`;
        mensagem += `• Tipo de Serviço: ${getTextoServico(dados.tipoServico)}\n`;
        mensagem += `• Descrição: ${dados.descricaoProjeto}\n`;
        mensagem += `• Prazo: ${getTextoPrazo(dados.prazo)}\n`;
        mensagem += `• Orçamento: ${getTextoOrcamento(dados.orcamento)}\n\n`;
        
        mensagem += `⚙️ *PREFERÊNCIAS*\n`;
        mensagem += `• Como conheceu: ${getTextoComoConheceu(dados.comoConheceu)}\n`;
        mensagem += `• Contato preferido: ${getTextoContato(dados.preferenciaContato)}\n`;
        
        if (dados.observacoes) {
            mensagem += `• Observações: ${dados.observacoes}\n`;
        }
        
        mensagem += `\n📅 *Data/Hora:* ${new Date().toLocaleString('pt-BR')}`;
        
        return mensagem;
    }
    
    // Funções auxiliares para converter valores
    function getTextoServico(valor) {
        const servicos = {
            // Desenvolvimento Web
            'site-institucional': '🏢 Site Institucional',
            'loja-online': '🛒 E-commerce / Loja Online',
            'landing-page': '📄 Landing Page',
            'portfolio': '🎨 Portfólio Profissional',
            'blog': '📰 Blog / Site de Notícias',
            
            // Automação e IA
            'chatbot': '💬 Chatbot Inteligente',
            'automacao-whatsapp': '📱 Automação WhatsApp',
            'assistente-virtual': '🤖 Assistente Virtual',
            
            // Sistemas e Suporte
            'sistema-personalizado': '⚙️ Sistema Personalizado',
            'suporte-tecnico': '🔧 Suporte Técnico',
            'manutencao-site': '🔄 Manutenção de Site',
            'consultoria-ti': '💡 Consultoria em TI',
            
            // Projetos Especiais
            'gestao-futebol': '⚽ Gestão de Futebol',
            'app-esportivo': '🏆 Aplicativo Esportivo',
            
            // Outros Serviços
            'consultoria-digital': '📈 Consultoria Digital',
            'treinamento': '🎓 Treinamento em Sistemas',
            'outro': '🔍 Outro'
        };
        return servicos[valor] || valor;
    }
    
    function getTextoPrazo(valor) {
        const prazos = {
            'urgente': 'Urgente (até 1 semana)',
            'rapido': 'Rápido (até 2 semanas)',
            'normal': 'Normal (até 1 mês)',
            'flexivel': 'Flexível (mais de 1 mês)'
        };
        return prazos[valor] || 'Não informado';
    }
    
    function getTextoOrcamento(valor) {
        const orcamentos = {
            'ate-700': 'Até R$ 700',
            '700-1500': 'R$ 700 - R$ 2.500',
            '1500-3000': 'R$ 2.500 - R$ 3.500',
            'acima-3000': 'Acima de R$ 3.500',
            'conversar': 'Prefiro conversar'
        };
        return orcamentos[valor] || 'Não informado';
    }
    
    function getTextoComoConheceu(valor) {
        const meios = {
            'indicacao': 'Instagram',
            'redes-sociais': 'Portfólio',
            'google': 'Google',
            'portfolio': 'Indicação',
            'outro': 'Outros'
        };
        return meios[valor] || valor;
    }
    
    function getTextoContato(valor) {
        const contatos = {
            'whatsapp': 'WhatsApp',
            'email': 'E-mail',
            'telefone': 'Telefone'
        };
        return contatos[valor] || valor;
    }
    
    // Função para exibir mensagem de status
    function exibirMensagem(tipo, texto) {
        // Remove mensagens anteriores
        const mensagensAnteriores = form.querySelectorAll('.status-message');
        mensagensAnteriores.forEach(msg => msg.remove());
        
        // Cria nova mensagem
        const mensagem = document.createElement('div');
        mensagem.className = `status-message ${tipo}`;
        mensagem.textContent = texto;
        mensagem.style.display = 'block';
        
        // Insere antes do botão
        submitButton.parentNode.insertBefore(mensagem, submitButton);
        
        // Remove após 5 segundos
        setTimeout(() => {
            if (mensagem.parentNode) {
                mensagem.remove();
            }
        }, 5000);
    }
    
    // Função para resetar o estado do botão
    function resetarBotao() {
        submitButton.classList.remove('btn-loading');
        submitButton.disabled = false;
        form.classList.remove('form-loading');
    }
    
    // Função para ativar estado de loading
    function ativarLoading() {
        submitButton.classList.add('btn-loading');
        submitButton.disabled = true;
        form.classList.add('form-loading');
    }
    
    // Event listener para o envio do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar formulário
        if (!validateForm()) {
            exibirMensagem('error', 'Por favor, preencha todos os campos obrigatórios corretamente.');
            return;
        }
        
        // Ativar loading
        ativarLoading();
        
        // Coletar dados
        const dados = coletarDadosFormulario();
        
        // Formatar mensagem
        const mensagem = formatarMensagemWhatsApp(dados);
        
        // Codificar mensagem para URL
        const mensagemCodificada = encodeURIComponent(mensagem);
        
        // Criar URL do WhatsApp
        const urlWhatsApp = `https://wa.me/${whatsappNumber}?text=${mensagemCodificada}`;
        
        // Simular delay de processamento
        setTimeout(() => {
            // Abrir WhatsApp
            window.open(urlWhatsApp, '_blank');
            
            // Exibir mensagem de sucesso
            exibirMensagem('success', 'Formulário enviado! Você será redirecionado para o WhatsApp.');
            
            // Resetar formulário após sucesso
            setTimeout(() => {
                form.reset();
                // Remover classes de validação
                const campos = form.querySelectorAll('.form-control');
                campos.forEach(campo => {
                    campo.classList.remove('is-valid', 'is-invalid');
                });
            }, 2000);
            
            resetarBotao();
        }, 1500);
    });
    
    // Smooth scroll para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Inicialização AOS (animações)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
});

// Função para adicionar o link do formulário ao menu (caso queira adicionar dinamicamente)
function adicionarLinkFormulario() {
    const navMenu = document.querySelector('#navmenu ul');
    if (navMenu && !document.querySelector('a[href="formulario.html"]')) {
        const li = document.createElement('li');
        li.innerHTML = '<a href="formulario.html">Formulário</a>';
        navMenu.appendChild(li);
    }
}
