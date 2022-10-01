//Inicializa variável quantidades do modal, do carrinho e de qual hamburguer
let cart = [];
let modalQtd = 1;
let modalKey = 0;

//Variáveis de preço caso deseje alterar
const oneMeatValue = 5;
const twoMeatsValue = 10;
const discount = 0.1;

//Listagem dos Hambúrguers
burgerJson.map((item, index) => {
    let burgerItem = document.querySelector('.models .burger-item').cloneNode(true);

    //Clona o modelo de itens e preenche com os dados
    burgerItem.setAttribute('data-key', index);
    burgerItem.querySelector('.burger-item--img img').src = item.img;
    burgerItem.querySelector('.burger-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    burgerItem.querySelector('.burger-item--name').innerHTML = item.name;
    burgerItem.querySelector('.burger-item--desc').innerHTML = item.description;

    //Inicializa o modal ao clicar
    burgerItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.burger-item').getAttribute('data-key');
        modalQtd = 1;
        modalKey = key;

        //Clona o modelo de itens na modal e preenche com os dados
        document.querySelector('.burgerBig img').src = burgerJson[key].img;
        document.querySelector('.burgerInfo h1').innerHTML = burgerJson[key].name;
        document.querySelector('.burgerInfo--desc').innerHTML = burgerJson[key].description;
        document.querySelector('.burgerInfo--actualPrice').innerHTML = `R$ ${burgerJson[key].price.toFixed(2)}`;

        //Zera a opção selecionada de tamanho toda vez que abre o modal
        document.querySelector('.burgerInfo--size.selected').classList.remove('selected');

        //Pra cada tamanho disponível, preenche os valores e deixa o 1º item selecionado
        document.querySelectorAll('.burgerInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex == 0){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = `(${burgerJson[key].sizes[sizeIndex]})`;
        })

        //Pega a quantidade disponível na variável e preenche
        document.querySelector('.burgerInfo--qt').innerHTML = modalQtd;

        //Seta a modal como flex para habilitá-la, e faz a animação com opacidade
        document.querySelector('.burgerWindowArea').style.opacity = 0;
        document.querySelector('.burgerWindowArea').style.display = 'flex';

        setTimeout(() => {
            document.querySelector('.burgerWindowArea').style.opacity = 1;
        }, 200);        
    });

    //Preenche os hamburguers na página
    document.querySelector('.burger-area').append(burgerItem);
});

//EVENTOS MODAL

//Fecha a janela modal
function closeModal() {
    document.querySelector('.burgerWindowArea').style.opacity = 0;
    document.querySelector('.burgerBuyOrder').style.opacity = 0;

    setTimeout(() => {
        document.querySelector('.burgerWindowArea').style.display = 'none';
        document.querySelector('.burgerBuyOrder').style.display = 'none';
    }, 500);   
}

//Botão de Cancelar
document.querySelectorAll('.burgerInfo--cancelMobileButton, .burgerInfo--cancelButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

//Botão de Fechar Ordem de Pedido
document.querySelectorAll('.burgerOrder--cancelButton, .burgerOrder--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', () => {
        //Fecha a modal, zera os itens do carrinho, remove a interface e atualiza o carrinho
        closeModal();
        cart.splice(0, cart.length);
        document.querySelector('aside').classList.remove('show');
        updateCart();
    });
});

//Ajuste de preço
document.querySelector('.burgerInfo--sizes').addEventListener('click', () => {
    let size = parseInt(document.querySelector('.burgerInfo--size.selected').getAttribute('data-key'));

    //Faz a verificação do tamanho do hamburguer, se for adicionado mais carnes, o valor muda
    if (size == 0){
        document.querySelector('.burgerInfo--actualPrice').innerHTML = `R$ ${burgerJson[modalKey].price}`;
    } else if (size == 1){
        let sizeUpdate = burgerJson[modalKey].price + oneMeatValue;
        document.querySelector('.burgerInfo--actualPrice').innerHTML = `R$ ${sizeUpdate.toFixed(2)}`;
    } else {
        let sizeUpdate = burgerJson[modalKey].price + twoMeatsValue;
        document.querySelector('.burgerInfo--actualPrice').innerHTML = `R$ ${sizeUpdate.toFixed(2)}`;
    }
});

//Botão de menos
document.querySelector('.burgerInfo--qtmenos').addEventListener('click', () => {
    if (modalQtd > 1){
        modalQtd--;
        document.querySelector('.burgerInfo--qt').innerHTML = modalQtd;
    }
});

//Botão de mais
document.querySelector('.burgerInfo--qtmais').addEventListener('click', () => {
    modalQtd++;
    document.querySelector('.burgerInfo--qt').innerHTML = modalQtd;
});

//Seleção de tamanhos
document.querySelectorAll('.burgerInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        document.querySelector('.burgerInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
})

//Adiciona ao carrinho
document.querySelector('.burgerInfo--addButton').addEventListener('click', () => {
    let size = parseInt(document.querySelector('.burgerInfo--size.selected').getAttribute('data-key'));

    //Faz a verificação do tamanho do hamburguer, se for adicionado mais carnes, o valor muda
    if (size == 1){
        burgerJson[modalKey].price += oneMeatValue;
    } else if (size == 2){
        burgerJson[modalKey].price += twoMeatsValue;
    }
    
    //Cria um identificador pra cada hamburguer e tipo
    let identifier = burgerJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item) => {
        return item.identifier == identifier;
    });

    //Adiciona no carrinho
    if (key > -1){
        cart[key].qt += modalQtd;
    } else {
        cart.push({
            identifier,
            id: burgerJson[modalKey].id,
            name: burgerJson[modalKey].name,
            size,
            qt: modalQtd,
            price: burgerJson[modalKey].price
        });
    }

    window.scrollTo(0, 0);
    updateCart();
    closeModal();
});

//Abre menu carrinho no mobile
document.querySelector('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0){
        document.querySelector('aside').style.left = '0';
    }
});

//Fecha menu carrinho no mobile
document.querySelector('.menu-closer').addEventListener('click', () => {
    if (cart.length > 0){
        document.querySelector('aside').style.left = '100vw';
    }
});

//Atualiza carrinho
function updateCart() {
    document.querySelector('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0){
        document.querySelector('aside').classList.add('show');
        document.querySelector('.cart').innerHTML = '';

        //Inicializa variaveis de preços
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        //Pra cada item no carrinho soma os valores do subtotal e atualiza as informações
        for(let i in cart){
            let burgerItem = burgerJson.find((item) => item.id == cart[i].id);
            subtotal += burgerItem.price * cart[i].qt;

            let cartItem = document.querySelector('.models .cart--item').cloneNode(true);

            //Insere junto do nome, o tamanho do hamburguer
            let burgerSizeName = cart[i].size;
            switch(cart[i].size){
                case 0:
                    burgerSizeName = '1 Carne';
                    break;
                case 1:
                    burgerSizeName = '2 Carnes';
                    break;
                case 2:
                    burgerSizeName = '3 Carnes';
                    break;
            }
            let burgerName = `${burgerItem.name} (${burgerSizeName})`;

            //Preenche as informações
            cartItem.querySelector('img').src = burgerItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = burgerName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            //Botão de mais e menos do carrinho
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1){
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }

                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            document.querySelector('.cart').append(cartItem);
        }

        //Calcula total baseado no valor de desconto
        desconto = subtotal * discount;
        total = subtotal - desconto;

        //Preenche os valores dos preços
        document.querySelector('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        document.querySelector('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        document.querySelector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        document.querySelector('aside').classList.remove('show');
        document.querySelector('aside').style.left = '100vw';
    }
}

 //Finaliza compra
document.querySelector('.cart--finalizar').addEventListener('click', () => {
    document.querySelector('.burgerBuyOrder').style.opacity = 0;
    document.querySelector('.burgerBuyOrder').style.display = 'flex';

    setTimeout(() => {
        document.querySelector('.burgerBuyOrder').style.opacity = 1;
    }, 200);   
    
    printValuesBuyOrder();
});

//Imprime Ordem de compra
function printValuesBuyOrder(){
    document.querySelector('.buyOrder-burger').innerHTML = '';
    let subtotal = 0, desconto = 0, total = 0;

    //Pega os itens que estão no carrinho e verifica o tamanho dos hamburguers
    for(let i in cart){
        let burgerSizeName = cart[i].size;

        switch(cart[i].size){
            case 0:
                burgerSizeName = '1 Carne';
                break;
            case 1:
                burgerSizeName = '2 Carnes';
                break;
            case 2:
                burgerSizeName = '3 Carnes';
                break;
        }

        let burgerName = `${cart[i].name} (${burgerSizeName})`;
        let burgerValue = cart[i].price * cart[i].qt;
        subtotal += burgerValue;

        //Insere os hamburguers na ordem de compra
        document.querySelector('.buyOrder-burger').append(
            `• ${cart[i].qt} - ${burgerName} = R\$ ${burgerValue.toFixed(2)}`
        );

        var br = document.createElement("br");
        document.querySelector('.buyOrder-burger').append(br);
    }

    desconto = subtotal * discount;
    total = subtotal - desconto;

    //Imprime na tela os valores da ordem
    var br2 = document.createElement("br");
    document.querySelector('.buyOrder-burger--total').innerHTML = '';
    document.querySelector('.buyOrder-burger--total').append(`Subtotal: R$ ${subtotal.toFixed(2)}`);
    document.querySelector('.buyOrder-burger--total').append(br);
    document.querySelector('.buyOrder-burger--total').append(`Desconto (-10%): R$ ${desconto.toFixed(2)}`);
    document.querySelector('.buyOrder-burger--total').append(br2);
    document.querySelector('.buyOrder-burger--total').append(`Total: R$ ${total.toFixed(2)}`);
}