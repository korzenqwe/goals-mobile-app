import type {
  SQLiteDatabase,
} from 'expo-sqlite'
import {
  Platform,
} from 'react-native'

export type SQLiteTransactionRunner = Pick<
  SQLiteDatabase,
  'execAsync' | 'getAllAsync' | 'getFirstAsync' | 'runAsync'
>

export async function runWriteTransaction<T>(
  database: SQLiteDatabase,
  task: (runner: SQLiteTransactionRunner) => Promise<T>,
): Promise<T> {
  let transactionResult: { value: T } | null = null

  if (Platform.OS === 'web') {
    await database.withTransactionAsync(async () => {
      transactionResult = {
        value: await task(database),
      }
    })

    return resolveTransactionResult(transactionResult)
  }

  await database.withExclusiveTransactionAsync(async (transaction) => {
    transactionResult = {
      value: await task(transaction),
    }
  })

  return resolveTransactionResult(transactionResult)
}

function resolveTransactionResult<T>(transactionResult: { value: T } | null) {
  if (!transactionResult) {
    throw new Error('Не удалось выполнить транзакцию.')
  }

  return transactionResult.value
}
