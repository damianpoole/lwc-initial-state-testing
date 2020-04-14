let createElement;

const createComponent = (config = {}, componentClass) => {
    const component = createElement('my-app', {
        is: componentClass
    });
    Object.assign(component, config);

    document.body.appendChild(component);

    return {
        component,
        root: component.shadowRoot
    };
};

describe('my-app', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    beforeEach(async () => {
        // we need to ensure module mocks are reset per test
        jest.resetModules();

        // resetting modules means we need to re-import createElement
        let { createElement: create } = await import('lwc');
        createElement = create;
    });

    it('Should initially have a disabled save button', async () => {
        const MyApp = await import('my/app');
        const { root } = createComponent({}, MyApp.default);

        expect(root.querySelector('button').disabled).toBe(true);
    });

    it('Should update the values when the inputs change', async () => {
        const MyApp = await import('my/app');
        const { root } = createComponent({}, MyApp.default);
        const input = root.querySelector('input');
        expect(input.value).toEqual('');

        // haven't spent any time figuring out best option for the change event
        // custom events are fine but i'm dealing with the standard input here and it
        // fires the change event.
        input.value = 'test';

        input.dispatchEvent(new Event('change'));

        await Promise.resolve();

        expect(input.value).toEqual('test');
    });

    it('Should have defaults setup', async () => {
        jest.doMock('../constants.js', () => {
            const originalModule = jest.requireActual('../constants.js');

            return {
                ...originalModule,
                DEFAULT_STATE: {
                    ...originalModule.DEFAULT_STATE,
                    firstName: 'A'
                }
            };
        });

        const MyApp = await import('my/app');

        const { root } = createComponent({}, MyApp.default);

        expect(root.querySelector('input').value).toEqual('A');

        // Now we can test our failing logic when we call `handleSave`
    });
});
