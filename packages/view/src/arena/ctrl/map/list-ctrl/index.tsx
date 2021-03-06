// eslint-disable-next-line
import React, { useState, useEffect } from 'react'
import s from './s.module.scss'
import IconButton from '@/component/icon-button'
import { of_map, map_list$, map_focu_id$, map_focu$, be_editing$, map_list_name_filter$ } from '../subj'
import { useObservable } from 'rxjs-hooks'
import { TextField } from 'office-ui-fabric-react'

/** 左上角列表控制, 添加 删除 */
export default function ListCtrl() {
    const use = useObservable(() => map_focu_id$)
    const name_fil = useObservable(() => map_list_name_filter$, '')
    return (
        <div className={s.ListCtrl}>
            <IconButton
                icon="Add"
                add_class={[s.btn]}
                onClick={() => {
                    const nmap = of_map()
                    const arr = map_list$.value
                    nmap.name = `地图-${arr.length + 1}`
                    map_list$.next([nmap, ...arr])
                    map_focu_id$.next(nmap.id)
                    map_focu$.next(nmap)
                    be_editing$.next(true)
                }}
            />
            {use && (
                <IconButton
                    icon="Delete"
                    add_class={[s.btn, s.del]}
                    onDoubleClick={() => {
                        const arr = map_list$.value
                        const fid = map_focu_id$.value
                        const narr = arr.filter((v) => v.id !== fid)
                        map_list$.next(narr)
                        map_focu_id$.next('')
                        map_focu$.next(undefined)
                    }}
                />
            )}
            <TextField
                underlined
                value={name_fil}
                onChange={(_, ns) => {
                    ns = ns || ''
                    map_list_name_filter$.next(ns)
                }}
                styles={{
                    root: {
                        margin: '0 10px',
                        width: '120px',
                    },
                    fieldGroup: {
                        backgroundColor: 'rgb(0,0,0,0)',
                    },
                }}
                iconProps={{ iconName: 'Zoom' }}
            />
        </div>
    )
}
