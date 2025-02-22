"use client";

import { createDataHook } from './useData'
import type { IAccount } from './../../types/accounts'
import type { ITransaction } from '@/types/transactions'
import type { IUser } from '@/types/auth'

export const useAccounts = createDataHook<IAccount[]>('accounts')
export const useTransactions = createDataHook<ITransaction[]>('transactions')
export const useUsers = createDataHook<IUser[]>('users')
