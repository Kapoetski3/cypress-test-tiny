describe('Test', () => {
  const response = {
    beveiligingsklasse: 1,
    bouwjaar: 2012,
    bouwmaand: 1,
    cataloguswaarde: 27000,
    dagwaarde: 4500,
    defaultDekkingen: {
      accessoires: [
        { key: 1, value: 0 },
        { key: 2, value: 0 },
        { key: 3, value: 0 }],
      geluidsapparatuur: [
        { key: 1, value: 0 },
        { key: 2, value: 0 },
        { key: 3, value: 0 }]
    },
    isBeveiligingsklasseVisible: false,
    isImport: false,
    isUserInputNeeded: false,
    kentekenIsGrijs: false,
    kentekenIsKnown: true,
    kleur: 2,
    koetswerk: 1,
    merk: 'Renault',
    model: 'Fluence Z.E.',
    voertuigtype: 1
  };

  it('Our desired solution with intercept', function () {
    cy.intercept('*api/autoverzekering/voertuiggegevens/get*').as('getKenteken');

    cy.intercept('*api/autoverzekering/voertuiggegevens/get*', {body: response, statusCode: 200}).as('getKenteken');

    cy.visit('www.independer.nl/autoverzekering');
    cy.wait(5000);

    cy.get('[data-e2e-id="kenteken"]', { timeout: 10000}).type('TT-742-X');
    cy.wait(['@getKenteken']);

    cy.get('[data-e2e-id="kentekenInfo"]').should('be.visible').should('contain', 'Renault Fluence Z.E.');
  });

  it('Our current working solution with cy.route', function () {
    cy.server();

    cy.route('GET', '*api/autoverzekering/voertuiggegevens/get*').as('getKenteken');

    cy.route('GET', '*api/autoverzekering/voertuiggegevens/get*', response).as('getKenteken');

    cy.visit('www.independer.nl/autoverzekering');
    cy.wait(5000);

    cy.get('[data-e2e-id="kenteken"]').type('TT-742-X');
    cy.wait(['@getKenteken']);

    cy.get('[data-e2e-id="kentekenInfo"]').should('be.visible').should('contain', 'Renault Fluence Z.E.');
  });

  it('Working when mocked data call is registered before call without mocked data', function () {
    cy.intercept('*api/autoverzekering/voertuiggegevens/get*', {body: response, statusCode: 200}).as('getKenteken');

    cy.intercept('*api/autoverzekering/voertuiggegevens/get*').as('getKenteken');

    cy.visit('www.independer.nl/autoverzekering');
    cy.wait(5000);

    cy.get('[data-e2e-id="kenteken"]').type('TT-742-X');
    cy.wait(['@getKenteken']);

    cy.get('[data-e2e-id="kentekenInfo"]').should('be.visible').should('contain', 'Renault Fluence Z.E.');
  });

  it('Working when we give the mocked data call a different alias and explicitly wait for that', function () {
    cy.intercept('*api/autoverzekering/voertuiggegevens/get*').as('getKenteken');

    cy.intercept('*api/autoverzekering/voertuiggegevens/get*', {body: response, statusCode: 200}).as('getKenteken1');

    cy.visit('www.independer.nl/autoverzekering');
    cy.wait(5000);

    cy.get('[data-e2e-id="kenteken"]').type('TT-742-X');
    cy.wait(['@getKenteken1']);

    cy.get('[data-e2e-id="kentekenInfo"]').should('be.visible').should('contain', 'Renault Fluence Z.E.');
  });
});
