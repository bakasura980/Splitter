(function() {
    assert.expectRevert = async function(promise) {
        try {
            let result = await promise;
        } catch (error) {
            const revert = error.message.search('revert') >= 0;
            assert(revert, "Expected throw, got '" + error + "' instead");
            return;
        }
        assert.fail('Expected throw not received');
    }
})();

