describe('Buy a product', () => {
    it('Visit home', () => {
        cy.visit('/');

        cy.get('.product').should('have.length', 12);
    });

    it('Visit product page', () => {
        //click first product
        cy.get('.product').first().click();
        // cy.url().should('include', '/produto/')
        cy.location('pathname', { timeout: 30000 })
            .should('include', '/produto/');
    });

    it('Add to cart and checkout', () => {
        //Get shipping costs
        cy.get('input[placeholder="00000-000"]')
            .type('01512-000')
            .should('have.value', '01512-000');
        cy.get('button[title="Calcular Frete"]').click();

        //Shipping costs results
        cy.contains('Rua Conde de Sarzedas - São Paulo / SP', { timeout: 30000 });
        cy.contains('PAC');
        cy.contains('SEDEX');

        //Add to cart
        cy.get('.plus').click();
        cy.get('.quantity > input[type="text"]').should('have.value', '2');
        cy.get('button').contains('Comprar').click();
        //Add to cart results
        cy.get('.cart-items-qty', { timeout: 60000 }).should('have.text', '(2)', { timeout: 60000 });

        //View cart page
        cy.get('.view-cart', { timeout: 60000 }).click();
        cy.location('pathname', { timeout: 30000 })
            .should('include', '/carrinho/');

        cy.contains("Você possui 2 itens no Carrinho", { timeout: 30000 });

        //Select another shipping method
        cy.get('#calc-shipping', { timeout: 50000 }).contains('Atualizar');
        cy.get('input[name="chosenShippingMethod"]').should('have.value', 'correios-pac3');
        cy.get('input[name="chosenShippingMethod"]').check('correios-sedex4');
        cy.get('input[name="chosenShippingMethod"]:checked')
            .should('have.value', 'correios-sedex4', { timeout: 3000 });

        //Add product quantity
        cy.get('.plus').click();
        cy.get('.quantity > input[type="text"]').should('have.value', '3');

        //Visit checkout page
        cy.get('.checkout-btn').click();
        cy.location('pathname', { timeout: 30000 })
            .should('include', '/finalizar-compra');

        cy.contains('FINALIZAR COMPRA', { timeout: 30000 });
        cy.get('.checkout-btn').click();
        cy.get('.checkout-btn').click();

        cy.get('input[name="firstName"]')
            .should('have.value', '');
        cy.contains('Erro: Nome é um campo obrigatório', { timeout: 9000 });

        //Fill the form
        cy.get('input[name="firstName"]')
            .type('John')
            .should('have.value', 'John');
        cy.get('input[name="lastName"]')
            .type('Doe')
            .should('have.value', 'Doe');
        cy.get('input[name="email"]')
            .type('tst@tst.com')
            .should('have.value', 'tst@tst.com');
        cy.get('input[name="phone"]')
            .type('11-98765-4321')
            .should('have.value', '(11) 98765-4321');
        cy.get('input[name="cpf"]')
            .type('12345678901')
            .should('have.value', '123.456.789-01');
        cy.get('input[name="postcode"]')
            .should('have.value', '01512-000');
        cy.get('input[name="address1"]')
            .should('have.value', 'Rua Conde de Sarzedas');
        cy.get('input[name="address2"]')
            .type('apto 44')
            .should('have.value', 'apto 44');
        cy.get('input[name="number"]')
            .type('123')
            .should('have.value', '123');
        cy.get('input[name="city"]')
            .should('have.value', 'São Paulo');
        cy.get('select[name="state"]')
            .should('have.value', 'SP');


        //Verify previouly selected shipping method
        // cy.get('input[name="chosenShippingMethod"]:checked')
        //     .should('have.value', 'correios-sedex4');

        //Go to Mercado Pago checkout
        cy.get('.checkout-btn').click();
        cy.contains('Como você prefere pagar?', { timeout: 30000 });
        cy.contains('Mercado Pago', { timeout: 30000 });

    });

});
