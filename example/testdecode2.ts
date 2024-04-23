import 'dotenv/config';
import { logger } from '../src/logger';
import { Connection, PublicKey, Finality } from '@solana/web3.js';
import * as fs from 'fs/promises';

import RaydiumIDL from '../src/raydium/idl/raydium_idl/idl.json'
import { BorshCoder, Idl } from '@coral-xyz/anchor';
import {
    RAYDIUM_AMM_V4_PROGRAM_ID,
    RAYDIUM_CLMM_PROGRAM_ID,
} from '@jup-ag/core';
import { RaydiumAmmCoder } from '../src/raydium/coder/index.js';

import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes/index';
import { deserialize } from 'borsh';

let rpc = process.env.RPC_HOST;
//let wss = process.env.WSS_HOST!;
logger.info("init connection " + `${rpc}`);
let connection = new Connection(`${process.env.RPC_HOST}`);
//import { compiledInstructionToInstruction, flattenTransactionResponse, parsedInstructionToInstruction, parseTransactionAccounts } from "../parser/helpers";

(async () => {
    logger.info('start.');
    //let txid = '3bSaEg71kkWDPtG94mn9bY8k2D7mABaqrQqL4F5JvzAEwukjqqwkjGhHBCb9fS5wVe1AG1J8i76ScKTZ59VGgJzt';
    //let txid = '2xcJTe8SUbsZftcdMNwXcaHs1LNWrvKWUqjoKJJ8Z5Bt8KvymXs5zmrzHZLs6QSeoLJFFSJBEiQcNQvrQKgoL8ye';
    //let txid = '6ndV4zos3PCagdhRh1pVSvzjvtxfbHwjGtzCAGjZmkYRTVQ1rSHeTG7VXa8AkAdsgBB2m1QqrJWC5bVJ3L6THea';
    let txid = '46R1DumF6TwvBDWn7P626214EzyTniM3JiR76id9dNY6ubPXqfrn3bS6VdNJBy3ZDy2NhTDQRsVADD8zTa2ywjB8';
    let commitment: Finality = "confirmed";
    //const tx = await connection.getTransaction(txid, { commitment: commitment, maxSupportedTransactionVersion: 0 });
    const tx = await connection.getParsedTransaction(txid, { commitment: commitment, maxSupportedTransactionVersion: 0 });
    try {
        const txJson = JSON.stringify(tx, null, 2); // The '2' argument for pretty formatting
        await fs.writeFile('./example/tx_' + txid + '.json', txJson, 'utf8');
    } catch (error) {

    }

    logger.info('tx ' + tx);
    logger.info('tx ' + tx?.meta?.logMessages);
    logger.info('tx ' + tx?.transaction.message.instructions);

    logger.info('idl ' + RaydiumIDL.version);
    logger.info('idl ' + RaydiumIDL.name);
    logger.info('idl ' + RaydiumIDL.instructions);
    logger.info('idl ' + RaydiumIDL.address);

    logger.info(tx?.meta?.innerInstructions);

    const ix = {
        programId: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
        data: '6HnDZPmoJMyxv3ERgDn59Af',
        accounts: [
            'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
            'uouNqhxwSP7X2YRCbrduc2UdXrJqQFtv5aXmZjGV9Uc',
            '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',
            'H2KA4e9KFgNhcHsznT6SE7tZzn5tnftrXD1Kw47nP7ra',
            '7avanAkD4X1aUuAkYZhrqRq5VLHjzrNdEy8hDNaiyFPt',
            'GaVrzXdm3haLeiB5tYLfxMch9L1upHsXcu6oNF4HFmCD',
            'FRmkVwS1bykZ8JVAqxht52H1LqmYVJiJF45rayrdXyWZ',
            'srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX',
            'EFxHrDK5DBBVa1yrHpEcDZaDxSuBzdagzEh3AB8PF4fr',
            '5PshYJysnyxgALbKhS218H4TA67E4oPAjy9oWpGpfh5K',
            'HbVvkoe16RcAo8AawpSej1T5oCbpLjccmMwqcMUMzxyB',
            '8Fs7L16Ypj7fjTQ1AENFWxDXsdbiV1v3XiygpKGGg9zm',
            'GaVrzXdm3haLeiB5tYLfxMch9L1upHsXcu6oNF4HFmCD',
            'FRmkVwS1bykZ8JVAqxht52H1LqmYVJiJF45rayrdXyWZ',
            'BXy1Y5U8Fhvs7bqsGvoabuSzeNqreo9kxtWuGv7JRDcp',
            'E7DgsxgvdKcp5oWxkviPNU8SLcCkr5qH39QAMnr9UsiD',
            'FWrZus8XZfLAn2HtZdrhRxCWoPjMgWRGwZJn2zQ4em73',
            'vEp6r1ArgChJsKghxCND4TVarEeVo6uSMWsEDFuCKER',
        ],
    };
    const coder = new BorshCoder(IDL as Idl);
    const schema = {
        struct: {
            discriminator: 'u8',
            amountIn: 'u64',
            minimumAmountOut: 'u64',
        },
    };
    const decoded = deserialize(
        schema,
        Buffer.from(bs58.decode('7YLw4Xyt46cAEJpi89ek18b'))
    );
    if (!decoded) return;
    const formatted = coder.instruction.format(
        {
            name: 'swapBaseIn',
            data: decoded,
        },
        ix.accounts.map((value) => ({
            pubkey: new PublicKey(value),
            isSigner: false,
            isWritable: false,
        }))
    );
    console.log(formatted);


})();

