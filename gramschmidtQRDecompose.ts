// Function to compute the dot product of two vectors
function dotProduct(v1: number[], v2: number[]): number {
    // The dot product is calculated by multiplying corresponding components of the vectors
    // and summing up the results. It measures the similarity or projection of one vector onto another.
    return v1.reduce((sum, _, i) => sum + v1[i] * v2[i], 0);
}

// Function to subtract one vector from another
function subtractVectors(v1: number[], v2: number[]): number[] {
    // This function performs vector subtraction by subtracting corresponding components
    // of the second vector (v2) from the first vector (v1). The result is a new vector.
    return v1.map((component, i) => component - v2[i]);
}

function transposeMatrix(matrix: number[][]): number[][] {
    const rows = matrix.length;
    const cols = matrix[0].length;

    // Create a new empty matrix with swapped dimensions
    const result: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));

    // Perform the transpose operation
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            result[j][i] = matrix[i][j];
        }
    }

    return result;
}

// Function to normalize a vector to unit length
function normalize(vector: number[]): number[] {
    // This function normalizes a vector by dividing each of its components
    // by the magnitude of the vector. The result is a vector with unit length.
    const magnitude = Math.sqrt(dotProduct(vector, vector));

    // Each component of the vector is divided by the magnitude to achieve normalization
    return vector.map((component) => component / magnitude);
}

function gramSchmidtQR(A: number[][]): {
    Q: number[][];  
    R: number[][]
} {
    const m = A.length;
    const n = A[0].length;

    const Q: number[][] = [];
    const R: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

    for (let j = 0; j < n; j++) {
        let v = [...A.map((row) => row[j])];

        for (let i = 0; i < j; i++) {
            const q = Q[i];
            const proj = dotProduct(v, q);
            v = subtractVectors(v, q.map((component) => component * proj));
            R[i][j] = proj;
        }

        Q[j] = normalize(v);

        for (let i = j; i < n; i++) {
            R[j][i] = dotProduct(Q[j], A.map((row) => row[i]));
        }
    }
    Q = transposeMatrix(Q);
    return { Q, R };
}


// Example usage
const A: number[][] = [
    [12,-51,4], [6,167,-68], [-4,24,-42],
];

let { Q, R } = gramSchmidtQR(A);

console.log("Matrix Q:");
Q = Q.map( (value) => {
    return value.map( (val) => Number(val.toFixed(2)))
})
console.log(Q);

console.log("Matrix R:");
R = R.map( (value) => {
    return value.map( (val) => Number(val.toFixed(2)))
})
console.log(R);

function areColumnsLinearlyIndependent(A: number[][]): boolean {
    const numRows = A.length;
    const numCols = A[0].length;

    // Create a copy of the matrix to avoid modifying the original
    const matrixCopy = A.map(row => [...row]);

    // Perform Gaussian elimination
    for (let col = 0; col < numCols; col++) {
        // Find the pivot row
        let pivotRow = -1;
        for (let row = col; row < numRows; row++) {
            if (matrixCopy[row][col] !== 0) {
                pivotRow = row;
                break;
            }
        }

        if (pivotRow === -1) {
            // No pivot element found, columns are linearly dependent
            return false;
        }

        // Swap rows to bring the pivot element to the top
        [matrixCopy[col], matrixCopy[pivotRow]] = [matrixCopy[pivotRow], matrixCopy[col]];

        // Eliminate other rows
        for (let row = 0; row < numRows; row++) {
            if (row !== col) {
                const factor = matrixCopy[row][col] / matrixCopy[col][col];
                for (let i = col; i < numCols; i++) {
                    matrixCopy[row][i] -= factor * matrixCopy[col][i];
                }
            }
        }
    }

    // Count the number of non-zero rows, which gives the rank
    const rank = matrixCopy.filter(row => row.some(element => element !== 0)).length;

    // Columns are linearly independent if and only if the rank is equal to the number of columns
    return rank === numCols;
}
const result = areColumnsLinearlyIndependent(A);

if (result) {
    console.log("Columns are linearly independent.");
} else {
    console.log("Columns are linearly dependent.");
}
