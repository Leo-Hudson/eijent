const BASE_URL = process.env.BASE_URL;

export const joinWaitList = async (payload) => {
    try {
        const response = await fetch(`${BASE_URL}/api/form-submission`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error(`Unable to submit your request. Please try again`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};