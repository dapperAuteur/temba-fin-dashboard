"use client";

import { createDataHook } from './useData'
import type { IAccount } from './../../types/accounts'
import { ITag } from '@/types/tags';
import type { ITransaction } from '@/types/transactions'
import type { IUser } from '@/types/users'
import type { IVendor } from '@/types/vendors'

export const useAccounts = createDataHook<IAccount[]>('accounts')
export const useTags = createDataHook<ITag[]>('tags')
export const useTransactions = createDataHook<ITransaction[]>('transactions')
export const useUsers = createDataHook<IUser[]>('users')
export const useVendors = createDataHook<IVendor[]>('vendors')
