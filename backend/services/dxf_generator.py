import ezdxf
import re

def generate_dxf(paths: list, output_path: str):
    doc = ezdxf.new("R2010", setup=True)
    msp = doc.modelspace()
    
    for path in paths:
        d = path.get("d", "")
        stroke_width = path.get("stroke_width", 1.5)
        
        commands = parse_svg_path(d)
        
        if len(commands) == 0:
            continue
        
        current_point = None
        
        for cmd in commands:
            cmd_type = cmd[0]
            
            if cmd_type == "M":
                current_point = (cmd[1], cmd[2])
            
            elif cmd_type == "L" and current_point:
                end_point = (cmd[1], cmd[2])
                msp.add_line(
                    start=(current_point[0], current_point[1], 0),
                    end=(end_point[0], end_point[1], 0),
                    dxfattribs={"lineweight": stroke_width}
                )
                current_point = end_point
            
            elif cmd_type == "Z":
                current_point = None
    
    doc.saveas(output_path)

def parse_svg_path(d: str):
    commands = []
    
    pattern = r'([MLCZ])\s*(-?\d+\.?\d*)\s*,?\s*(-?\d+\.?\d*)\s*,?\s*'
    matches = re.findall(pattern, d)
    
    for match in matches:
        cmd = match[0]
        try:
            x = float(match[1])
            y = float(match[2])
            commands.append((cmd, x, y))
        except ValueError:
            continue
    
    return commands

def svg_to_dxf_points(d: str) -> list:
    points = []
    pattern = r'M\s*(\d+\.?\d*)\s*,?\s*(\d+\.?\d*)'
    matches = re.findall(pattern, d)
    
    for match in matches:
        try:
            x = float(match[0])
            y = float(match[1])
            points.append((x, y))
        except ValueError:
            continue
    
    return points