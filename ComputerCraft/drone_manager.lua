local args = { ... }

-- default values
args[1] = args[1] or 3 -- X
args[2] = args[2] or 2 -- Y
args[3] = args[3] or 3 -- Z


function deploy_drones(amount)
	
	-- iterate drone deployment
	for i = 1, amount do

		-- create or wait for empty space
		::check_block::
		if safeMine('up') then
			sleep(.5)
			goto check_block
		end

		-- local success, data = turtle.inspectUp()
		
		-- -- wait for empty space
		-- if success then
		-- 	-- is not turtle? dig
		-- 	if not
		-- 	 ( data.name == 'computercraft:turtle_expanded' -- TODO: replace namespace with label or blacklist
		-- 	or data.name == 'computercraft:turtle_advanced' ) then
		-- 		turtle.digUp()
		-- 	end

		-- 	sleep(0.5)
		-- 	goto check_block
		-- end

		turtle.placeUp()

		-- TODO: transfer and execute code to drones

		-- increment slot every 64th deploy

		-- conditional
		-- if i % amount == 0 then
		-- 	turtle.select(i * .015625 + 1)
		-- end

		-- non-conditional
		turtle.select(math.floor(i * .015625) + 1)
	end
end


function retrieve_drones(amount)
	local retrieved = amount
	while retrieved > 0 do
		local success, data = turtle.inspectUp()
		if success then
			turtle.digUp()
			retrieved = retrieved - 1
		end
		sleep(0.5)
	end
end


function safeMine(idir, blacklist)

	blacklist = blacklist or
	{
		'computercraft:turtle_expanded',
		'computercraft:turtle_advanced'
	}

	local dir = {
		'forward' = {'inspect' = turtle.inspect,	 'dig' = turtle.dig    },
		   'down' = {'inspect' = turtle.inspectDown, 'dig' = turtle.digDown}
			 'up' = {'inspect' = turtle.inspectUp,	 'dig' = turtle.digUp  },
	}[idir]

	local success, data = dir.inspect()

	if success then
		for _, v in ipairs(blacklist) do
			if data.name == v then
				goto noMine
			end
		end
		dir.dig()
	end
	::noMine::

	return success, data
end


-- DEFAULT DIRECTION IS EXPECTED TO BE EAST
-- start/target: dict {"x":1, "y":2, "z":3}
function navigate(start, target, elevation)

	-- raise to elevation if specified
	if elevation then
		for y = start.y, elevation do
			safeMine('up')
			turtle.up()
		end
	end

	local dx = target.x - start.x
	local adx = math.abs(dx)

	local dz = target.z - start.z
	local adz = math.abs(dz)

	-- local dy = target.y - start.y
	-- local ady = math.abs(dy)

	local move = {
		0=turtle.forward,
		1=turtle.back,
		2=turtle.turnLeft,
		3=turtle.turnRight
	}

	local xpos = (dx < 0)
	local zpos = (dz < 0)

	for x = 0, adx do
		safeMine('forward')
		move[xpos]()
	end

		turtle.turnRight()
	
	for z = 0, adz do
		safeMine('forward')
		move[zpos]()
	end
	
	for y = elevation, target.y, -1 do
		safeMine('down')
		turtle.down()
	end

end
