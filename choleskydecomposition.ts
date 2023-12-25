type Matrix = number[][];
function choleskyDecomposition(A: number[][]): number[][] {
    const n = A.length;
    const L: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

    // Step 1: Compute L's diagonal elements
    for (let i = 0; i < n; i++) {
        for (let j = 0; j <= i; j++) {
            if (i === j) {
                // Diagonal element calculation
                L[i][j] = Math.sqrt(A[i][i] - L[i].slice(0, j).reduce((sum, val) => sum + val ** 2, 0));
            } else {
                // Non-diagonal element calculation
                L[i][j] = (A[i][j] - L[i].slice(0, j)
                .reduce((sum,   Lij, k) => { console.log(Lij);
                return                sum + Lij * L[j][k]}, 0)) / L[j][j];
            }
        }
    }

    return L;
}

function verifyCholeskyDecomposition(A: number[][], L: number[][]): void {
    const n = A.length;

    // Step 2: Verify A = LL^T
    const reconstructedA = L.map((row, i) =>
        row.map((_, j) => L[i].reduce((sum, Lij, k) => sum + Lij * L[j][k], 0))
    );

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            // Check if the reconstructed matrix is close to the original matrix
            if (Math.abs(A[i][j] - reconstructedA[i][j]) > 1e-8) {
                throw new Error("Cholesky decomposition verification failed.");
            }
        }
    }
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

function multiplyMatrices(matrix1: number[][], matrix2: number[][]): number[][] {
    const rows1 = matrix1.length;
    const cols1 = matrix1[0].length;
    const cols2 = matrix2[0].length;

    // Check if matrices are valid for multiplication
    if (cols1 !== matrix2.length) {
        throw new Error("Invalid matrices for multiplication: Number of columns in the first matrix must be equal to the number of rows in the second matrix.");
    }

    // Create a new empty matrix for the result
    const result: number[][] = Array.from({ length: rows1 }, () => Array(cols2).fill(0));

    // Perform matrix multiplication
    for (let i = 0; i < rows1; i++) {
        for (let j = 0; j < cols2; j++) {
            for (let k = 0; k < cols1; k++) {
                result[i][j] += matrix1[i][k] * matrix2[k][j];
            }
        }
    }

    return result;
}

// Function to print a matrix
function printMatrix(matrix: Matrix): void {
  matrix.forEach(row => console.log(row.join('\t')));
}

// Example usage
const A: number[][] = [
    [7, 3, -1, 2], [3, 8, 1, -4], [-1, 1, 4, -1], [2, -4, -1, 6]
];

const L = choleskyDecomposition(A);
const m = L.map( (value) => {
    return value.map( (val) => Number(val.toFixed(2)))
});
const transposeOfL = transposeMatrix(L);
const formatedLT = transposeOfL.map( (value) => {
    return value.map( (val) => Number(val.toFixed(2)))
});
const LLT = multiplyMatrices(L,transposeOfL);
const formattedLLT = LLT.map( (value) => {
    return value.map( (val) => Number(val.toFixed(2)))
});



console.log("Matrix A:");
printMatrix(A);
console.log("Matrix L:");
printMatrix(m)
console.log("Matrix LT:");
printMatrix(formatedLT)
console.log("Matrix LLT:");
printMatrix(formattedLLT)

try {
    verifyCholeskyDecomposition(A, L);
    console.log("Cholesky decomposition verified successfully.");
} catch (error) {
    console.error(error.message);
}
