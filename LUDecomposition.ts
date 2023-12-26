type Matrix = number[][];

function createMatrix(size: number): Matrix {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function identityMatrix(size: number): Matrix {
  return createMatrix(size).map((row, i) => row.map((_, j) => (i === j ? 1 : 0)));
}

function multiply(A: Matrix, B: Matrix): Matrix {
  const result = createMatrix(A.length);
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A.length; j++) {
      for (let k = 0; k < A.length; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return result;
}

function decomposeLU(A: Matrix): { L: Matrix; U: Matrix } {
  const n = A.length;
  const L = identityMatrix(n);
  const U = createMatrix(n);

  for (let k = 0; k < n; k++) {
    for (let i = 0; i <= k; i++) {
      let sum = 0;
      for (let j = 0; j < i; j++) {
        sum += L[i][j] * U[j][k];
      }
      U[i][k] = A[i][k] - sum;
    }

    for (let i = k + 1; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < k; j++) {
        sum += L[i][j] * U[j][k];
      }
      L[i][k] = (A[i][k] - sum) / U[k][k];
    }
  }

  return { L, U };
}

function verifyDecomposition(A: Matrix, L: Matrix, U: Matrix): boolean {
  const LU = multiply(L, U);
  console.log("LU", LU)
  return A.every((row, i) => row.every((val, j) => Math.abs(val - LU[i][j]) < 1e-8));
}

function isSymmetric(matrix: Matrix): boolean {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (matrix[i][j] !== matrix[j][i]) {
        return false;
      }
    }
  }
  return true;
}

function isPositiveDefinite(matrix: Matrix): boolean {
  const n = matrix.length;

  // Check if the matrix is symmetric
  if (!isSymmetric(matrix)) {
    return false;
  }

  // Check if all leading principal minors have positive determinants
  for (let i = 1; i <= n; i++) {
    const subMatrix = matrix.slice(0, i).map((row) => row.slice(0, i));
    const determinant = calculateDeterminant(subMatrix);
    if (determinant <= 0) {
      return false;
    }
  }

  return true;
}

function calculateDeterminant(matrix: Matrix): number {
  const n = matrix.length;

  if (n === 1) {
    return matrix[0][0];
  }

  if (n === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }

  let det = 0;

  for (let i = 0; i < n; i++) {
    const subMatrix = matrix.slice(1).map((row) => row.filter((_, j) => j !== i));
    det += matrix[0][i] * calculateDeterminant(subMatrix) * (i % 2 === 0 ? 1 : -1);
  }

  return det;
}

function elementaryType1(size: number, row: number, scalar: number): Matrix {
  const E = identityMatrix(size);
  E[row][row] = scalar;
  console.log("E", E)
  return E;
}

function elementaryType2(size: number, targetRow: number, sourceRow: number, multiplier: number): Matrix {
  const E = identityMatrix(size);
  E[targetRow][sourceRow] = multiplier;
  console.log("E", E)
  return E;
}

function elementaryType3(size: number, row1: number, row2: number): Matrix {
  const E = identityMatrix(size);
  [E[row1], E[row2]] = [E[row2], E[row1]];
  console.log("E", E)
  return E;
}

// Example usage
const A: Matrix = [
  [4, 2, -2],
  [2, 5, 4],
  [-2, 4, 8],
];

const n=3

const E1 = elementaryType1(n, 1, 2); // Multiply row 1 by 2
  const E2 = elementaryType2(n, 2, 1, 3); // Add 3 times row 2 to row 3
  const E3 = elementaryType3(n, 0, 2); // Swap rows 1 and 3

  const A1 = multiply(E1, A);
  const A2 = multiply(E2, A1);
  const A3 = multiply(E3, A);
  console.log("A3", A3);

if(isSymmetric(A) && isPositiveDefinite(A)){
    const { L, U } = decomposeLU(A);
    const isDecompositionCorrect = verifyDecomposition(A, L, U);

    console.log("Matrix A:", A);
    console.log("Matrix L:", L);
    console.log("Matrix U:", U);
    console.log("Is A = LU?", isDecompositionCorrect);
} else {
    throw new Error("Matrix is not Symmetric || Not Positive Definite")
}


