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

function findNullSpaceSolution(matrix: number[][]): number[][] {
    const numCols = matrix[0].length;
    const { pivotColumns, nonPivotColumns} = identifyPivotColumns(matrix);

    return Array.from({ length: numCols - pivotColumns.length }, (_, index) => {
      const nullSpaceVector: number[] = Array(numCols - 1).fill(0);
      nullSpaceVector[pivotColumns.length + index] = 1;

      pivotColumns.forEach((col, rowIndex) => {
        nullSpaceVector[col] = -matrix[rowIndex][pivotColumns.length + index];
      });

      return nullSpaceVector;
    });
}

function findParticularSolution(matrix: number[][]): number[] {
    const numRows = matrix.length;
    const numCols = matrix[0].length;

    const particularSolution: number[] = Array(numCols - 1).fill(0);

    for (let row = 0; row < numRows; row++) {
      const pivotColumn = matrix[row].findIndex((elem) => elem !== 0);

      if (pivotColumn !== -1) {
        particularSolution[pivotColumn] = matrix[row][numCols - 1];
      }
    }

    return particularSolution;
  }
  



function findGeneralSolution(
    pivotColumns: number[],
    nonPivotColumns: number[],
    particularSolution: number[]
  ): string {
    const variableTerms = pivotColumns.map((col) => `x${col + 1}`).join(", ");
    const constantTerms = particularSolution.map((value) => value.toFixed(2)).join(", ");
    const generalSolution = `[${variableTerms}] + [${constantTerms}] + [${nonPivotColumns.map((col) => `x${col + 1}`).join(", ")}]`;

    return generalSolution;
  }
// Function to print a matrix
function printMatrix(matrix: Matrix): void {
  matrix.forEach(row => console.log(row.join('\t')));
  console.log();
}

// Example usage:
const m = 3;
const n = 4;
const A: number[][] = [[1,2,3,4,5,6,7], [0,1,0,1,0,1,0], [2,2,2,2,2,2,2],
[-1,0,1,-2,1,0,1],[0,0,1,1,1,1,1]];
const b: number[] = [10,1,14,-2,5];
// const A: number[][] = [[2,1,-1,3,4,2,5], [1,-1,3,2,1,6,2], [3,2,2,1,5,7,1],
// [4,3,1,2,6,8,3],[5,4,0,4,8,10,4]];
// const b: number[] = [1,3,5,7,9];
// const A: number[][] = [[1,1,1], [2,1,1]];
// const b: number[] = [3,4];
// const A: Matrix = [
//     [1, 4, 7],
//     [2, 5, 8],
//     [3, 6, 9],
// ];

// const b: number[] = [10, 11, 12];

// Step 1: Create augmented matrix
const augmentedMatrixResult = augmentedMatrix(A, b);

// Step 2: Convert to row echelon form (REF)
const refMatrixResult = rowEchelonForm([...augmentedMatrixResult]);

// Step 3: Convert to reduced row echelon form (RREF)
const rrefMatrixResult = reducedRowEchelonForm([...refMatrixResult]);



// Display results
console.log("Augmented Matrix:");
printMatrix(augmentedMatrixResult);
console.log("Row Echelon Form:");
printMatrix(refMatrixResult);
console.log("Reduced Row Echelon Form:");
printMatrix(rrefMatrixResult);

// TAG: Step 4: Identify pivot and non-pivot columns
const { pivotColumns, nonPivotColumns } = identifyPivotColumns(rrefMatrixResult);
console.log("\nTAG: Step 4: Pivot Columns and Non-Pivot Columns");
console.log("Pivot Columns:", pivotColumns);
console.log("Non-Pivot Columns:", nonPivotColumns);

const particularSol = findParticularSolution(rrefMatrixResult);
console.log("Updated particularSol", particularSol)

const nullSpaceSolution = findNullSpaceSolution(rrefMatrixResult);
console.log("Updated homogeneous", nullSpaceSolution);


const generalSolution = findGeneralSolution(pivotColumns, nonPivotColumns, particularSol);
console.log("Updated generalSolution", generalSolution);
