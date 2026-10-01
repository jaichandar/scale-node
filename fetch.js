const testing = async () => {
    const requests = [];

    for (let i = 0; i < 500; i++) {
        requests.push(
            fetch("https://scale-node.onrender.com/loop")
                .then(async (res) => {
                    if (!res.ok) {
                        throw new Error(`HTTP ${res.status}`);
                    }

                    return res.json();
                })
                .catch((err) => {
                    return {
                        error: err.message
                    };
                })
        );
    }

    const results = await Promise.all(requests);

    console.log(results, "<0000");

    const successful = results.filter(
        (result) => !result.error
    );

    const failed = results.filter(
        (result) => result.error
    );

    console.log("Successful:", successful.length);
    console.log("Failed:", failed.length);
};

testing();