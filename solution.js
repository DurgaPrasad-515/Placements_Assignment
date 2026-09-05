// Function to convert a number from any base to BigInt
function convertToDecimal(value, base) {
    const chars = value.toLowerCase();
    const b = BigInt(base);

    let result = 0n;

    for (const ch of chars) {
        let digit;

        if (ch >= '0' && ch <= '9') {
            digit = BigInt(ch.charCodeAt(0) - '0'.charCodeAt(0));
        } else {
            digit = BigInt(ch.charCodeAt(0) - 'a'.charCodeAt(0) + 10);
        }

        result = result * b + digit;
    }

    return result;
}


// Find the constant term using Lagrange Interpolation
function findConstant(points) {
    let numeratorSum = 0n;
    let denominatorCommon = 1n;

    // We calculate each Lagrange term as a fraction
    const fractions = [];

    for (let i = 0; i < points.length; i++) {
        let xi = BigInt(points[i].x);
        let yi = points[i].y;

        let numerator = yi;
        let denominator = 1n;

        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                let xj = BigInt(points[j].x);

                // At x = 0:
                // (0 - xj) / (xi - xj)
                numerator *= -xj;
                denominator *= (xi - xj);
            }
        }

        fractions.push({ numerator, denominator });
    }

    // Find common denominator
    for (const fraction of fractions) {
        denominatorCommon *= fraction.denominator;
    }

    // Add fractions
    for (let i = 0; i < fractions.length; i++) {
        let numerator = fractions[i].numerator;

        for (let j = 0; j < fractions.length; j++) {
            if (i !== j) {
                numerator *= fractions[j].denominator;
            }
        }

        numeratorSum += numerator;
    }

    return numeratorSum / denominatorCommon;
}


// Main function
function solve(data) {

    const n = data.keys.n;
    const k = data.keys.k;

    const points = [];

    // Take first k roots
    for (let i = 1; i <= k; i++) {

        const base = parseInt(data[i].base);
        const value = data[i].value;

        const decimalValue = convertToDecimal(value, base);

        points.push({
            x: i,
            y: decimalValue
        });
    }

    const secret = findConstant(points);

    console.log("Decoded Points:");

    for (const point of points) {
        console.log(
            `x = ${point.x}, y = ${point.y.toString()}`
        );
    }

    console.log("\nConstant Term / Secret:");
    console.log(secret.toString());
}


// =========================
// SECOND TEST CASE
// =========================

const data = {
  "keys": {
    "n": 10,
    "k": 7
  },
  "1": {
    "base": "6",
    "value": "13444211440455345511"
  },
  "2": {
    "base": "15",
    "value": "aed7015a346d635"
  },
  "3": {
    "base": "15",
    "value": "6aeeb69631c227c"
  },
  "4": {
    "base": "16",
    "value": "e1b5e05623d881f"
  },
  "5": {
    "base": "8",
    "value": "316034514573652620673"
  },
  "6": {
    "base": "3",
    "value": "2122212201122002221120200210011020220200"
  },
  "7": {
    "base": "3",
    "value": "20120221122211000100210021102001201112121"
  },
  "8": {
    "base": "6",
    "value": "20220554335330240002224253"
  },
  "9": {
    "base": "12",
    "value": "45153788322a1255483"
  },
  "10": {
    "base": "7",
    "value": "1101613130313526312514143"
  }
};

solve(data);