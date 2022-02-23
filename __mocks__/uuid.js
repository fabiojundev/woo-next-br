jest.mock('uuid', () => {
    return {
        __esModule: true,
        v4: jest.fn().mockReturnValue('123'),
    };
});
