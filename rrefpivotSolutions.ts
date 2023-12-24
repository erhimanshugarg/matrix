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

/**
 * TAG: Identify the pivot and non-pivot columns.
 * @param augmentedMatrix - The augmented matrix in reduced row echelon form.
 * @returns An object with pivot and non-pivot column indices.
 */
function identifyPivotColumns(augmentedMatrix: Matrix): { pivotColumns: number[]; nonPivotColumns: number[] } {
    const pivotColumns: number[] = [];
    const nonPivotColumns: number[] = [];

    augmentedMatrix.forEach((row, i) => {
        const pivotIndex = row.findIndex((element) => element !== 0);

        if (pivotIndex !== -1) {
            pivotColumns.push(pivotIndex);
        }
    });

    for (let j = 0; j < augmentedMatrix[0].length - 1; j++) {
        if (!pivotColumns.includes(j)) {
            nonPivotColumns.push(j);
        }
    }

    return { pivotColumns, nonPivotColumns };
}

/**
 * Find the particular solution, solutions to Ax = 0, and general solutions.
 * @param augmentedMatrix - The augmented matrix in reduced row echelon form.
 * @returns An object with particular solution, solutions to Ax = 0, and general solutions.
 */
function findSolutions(augmentedMatrix: Matrix): {
    particularSolution: number[];
    homogeneousSolutions: number[][];
    generalSolutions: number[][];
} {
    const { pivotColumns, nonPivotColumns } = identifyPivotColumns(augmentedMatrix);
    const m = augmentedMatrix.length;
    const n = augmentedMatrix[0].length;

    const particularSolution: number[] = Array(n - 1).fill(0);
    const homogeneousSolutions: number[][] = [];
    const generalSolutions: number[][] = [];

    augmentedMatrix.forEach((row, i) => {
        const isPivotRow = pivotColumns.includes(i);

        for (let j = 0; j < n - 1; j++) {
            if (isPivotRow) {
                particularSolution[j] += row[j];
            }
        }

        if (!isPivotRow) {
            const homogeneousSolution: number[] = Array(n - 1).fill(0);
            homogeneousSolution[nonPivotColumns.indexOf(row.findIndex((el) => el !== 0))] = 1;
            homogeneousSolutions.push(homogeneousSolution);
        }
    });

    nonPivotColumns.forEach((columnIndex) => {
        const generalSolution: number[] = Array(n - 1).fill(0);
        generalSolution[columnIndex] = 1;
        generalSolutions.push(generalSolution);
    });

    return { particularSolution, homogeneousSolutions, generalSolutions };
}


// Example usage:
const m = 3;
const n = 4;
const A: Matrix = [[-2,4,-2,-1,4], [4,-8,3,-3,1], [1,-2,1,-1,1], [1,-2,0,-3,4]];
const b: number[] = [-3, 2, 0, -1];

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

// TAG: Step 4: Identify pivot and non-pivot columns
const { pivotColumns, nonPivotColumns } = identifyPivotColumns(rrefMatrixResult);
console.log("\nTAG: Step 4: Pivot Columns and Non-Pivot Columns");
console.log("Pivot Columns:", pivotColumns);
console.log("Non-Pivot Columns:", nonPivotColumns);

// Step 5: Find particular solution, solutions to Ax = 0, and general solutions
const { particularSolution, homogeneousSolutions, generalSolutions } = findSolutions(rrefMatrixResult);
console.log("\nStep 5: Particular Solution, Homogeneous Solutions, and General Solutions");
console.log("Particular Solution:", particularSolution);
console.log("Homogeneous Solutions to Ax = 0:", homogeneousSolutions);
console.log("General Solutions:", generalSolutions);
