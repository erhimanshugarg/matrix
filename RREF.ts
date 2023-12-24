type Matrix = number[][];

/**
 * Combines matrix A and vector b into an augmented matrix [A | b].
 * @param A - The coefficient matrix.
 * @param b - The column vector.
 * @returns The augmented matrix [A | b].
 */
function augmentedMatrix(A: Matrix, b: number[]): Matrix {
    return A.map((row, i) => [...row, b[i]]);
}

/**
 * Converts the matrix to row echelon form (REF) using Gaussian elimination.
 * @param matrix - The matrix to be transformed.
 * @returns The matrix in row echelon form.
 */
function rowEchelonForm(matrix: Matrix): Matrix {
   const m = matrix.length;
    const n = matrix[0].length;

    for (let i = 0; i < m; i++) {
        // Find the pivot (the first non-zero element in the row)
        const pivotIndex = matrix[i].findIndex((element) => element !== 0);

        // Skip if the entire row is zero
        if (pivotIndex === -1) {
            continue;
        }

        // Make the pivot element 1
        const pivot = matrix[i][pivotIndex];
        if ( pivot != null ) {
            matrix[i] = matrix[i].map((element) => element / pivot);
        }else {
            console.error("Division by zero. Choose a different A and/or b.")
            throw new Error("Division by zero. Choose a different A and/or b.");
        }

        // Eliminate below the pivot
        for (let j = i + 1; j < m; j++) {
            const factor = matrix[j][pivotIndex];
            matrix[j] = matrix[j].map((element, k) => element - factor * matrix[i][k]);
        }
    }

    return matrix;
}

/**
 * Converts the matrix to reduced row echelon form (RREF).
 * @param matrix - The matrix in row echelon form.
 * @returns The matrix in reduced row echelon form.
 */
function reducedRowEchelonForm(matrix: Matrix): Matrix {
    const m = matrix.length;
    for (let i = m - 1; i >= 0; i--) {
        // Find the pivot (the first non-zero element in the row)
        const pivotIndex = matrix[i].findIndex((element) => element !== 0);
  
        // Skip if the entire row is zero
        if (pivotIndex === -1) {
            continue;
        }


        // Eliminate above the pivot
        for (let j = i - 1; j >= 0; j--) {
            const factor = matrix[j][pivotIndex];
            matrix[j] = matrix[j].map((element, k) =>{
              return element - factor * matrix[i][k]
              });
        }
    }

    return matrix;
}

// Example usage:
const m = 3;
const n = 4;
const A: Matrix = [[1, 5, 1], [2, 11, 5]];
const b: number[] = [10, 11];

// Step 1: Create augmented matrix
const augmentedMatrixResult = augmentedMatrix(A, b);

// Step 2: Convert to row echelon form (REF)
const refMatrixResult = rowEchelonForm([...augmentedMatrixResult]);

// Step 3: Convert to reduced row echelon form (RREF)
const rrefMatrixResult = reducedRowEchelonForm([...refMatrixResult]);

// Display results
console.log("Augmented Matrix:");
console.log(augmentedMatrixResult);
console.log("\nRow Echelon Form:");
console.log(refMatrixResult);
console.log("\nReduced Row Echelon Form:");
console.log(rrefMatrixResult);
